#!/usr/bin/env node
/**
 * Generates gemini-context.md for Gemini session bootstrap (UTF-8, no BOM).
 * Cross-platform clipboard copy; failures are non-fatal.
 */

import { spawn } from "node:child_process";
import {
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { platform, release, tmpdir } from "node:os";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_FILE = join(ROOT, "gemini-context.md");
const MAX_TREE_DEPTH = 3;
const MAX_LOGIC_FILES = 7;

const IGNORE_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  ".next",
  "dist",
  "build",
  "coverage",
  ".turbo",
  ".vercel",
  ".snowflake",
  ".v0-trash",
  "pnpm-store",
  ".pnpm",
  "__pycache__",
  ".cursor",
]);

const LOGIC_KEYWORDS = [
  "fetch",
  "api",
  "client",
  "store",
  "state",
  "reducer",
  "context",
  "provider",
  "map",
  "geo",
  "three",
  "flow",
  "shell",
  "data.ts",
  "regions",
];

const LOGIC_NAME_HINTS = [
  "data.ts",
  "data.tsx",
  "client",
  "api",
  "store",
  "map",
  "shell",
  "flow",
  "view.tsx",
  "layout.tsx",
  "page.tsx",
  "proxy",
  "routing",
  "request.ts",
];

function formatJstNow() {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

async function readProjectName() {
  try {
    const raw = await readFile(join(ROOT, "package.json"), "utf8");
    const pkg = JSON.parse(raw);
    return pkg.name ?? "unknown-project";
  } catch {
    return "unknown-project";
  }
}

async function buildTreeLines(dir, prefix = "", depth = 0) {
  if (depth >= MAX_TREE_DEPTH) return [];

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const visible = entries
    .filter((e) => !IGNORE_DIR_NAMES.has(e.name))
    .filter((e) => !e.name.startsWith(".") || e.name === ".env.example")
    .sort((a, b) => {
      if (a.isDirectory() !== b.isDirectory()) {
        return a.isDirectory() ? -1 : 1;
      }
      return a.name.localeCompare(b.name, "en");
    });

  const lines = [];
  for (let i = 0; i < visible.length; i++) {
    const entry = visible[i];
    const isLast = i === visible.length - 1;
    const branch = isLast ? "└── " : "├── ";
    const childPrefix = isLast ? "    " : "│   ";
    lines.push(`${prefix}${branch}${entry.name}${entry.isDirectory() ? sep : ""}`);

    if (entry.isDirectory()) {
      const sub = await buildTreeLines(
        join(dir, entry.name),
        prefix + childPrefix,
        depth + 1,
      );
      lines.push(...sub);
    }
  }
  return lines;
}

async function readDependenciesBlock() {
  try {
    const raw = await readFile(join(ROOT, "package.json"), "utf8");
    const pkg = JSON.parse(raw);
    const subset = {
      dependencies: pkg.dependencies ?? {},
      devDependencies: pkg.devDependencies ?? {},
    };
    return JSON.stringify(subset, null, 2);
  } catch {
    return JSON.stringify(
      { dependencies: {}, devDependencies: {}, error: "package.json unreadable" },
      null,
      2,
    );
  }
}

async function collectFilesRecursive(dir, predicate) {
  const found = [];
  if (!existsSync(dir)) return found;

  async function walk(current) {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      if (IGNORE_DIR_NAMES.has(entry.name)) continue;
      const full = join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (predicate(full, entry.name)) {
        found.push(full);
      }
    }
  }

  await walk(dir);
  return found.sort((a, b) => a.localeCompare(b, "en"));
}

function isTypeDefinitionFile(_fullPath, name) {
  return name.endsWith(".d.ts");
}

function isTestOrSpec(name) {
  return (
    name.includes(".test.") ||
    name.includes(".spec.") ||
    name.endsWith(".test.ts") ||
    name.endsWith(".test.tsx") ||
    name.endsWith(".spec.ts") ||
    name.endsWith(".spec.tsx")
  );
}

function isLogicCandidate(fullPath, name) {
  if (isTestOrSpec(name)) return false;
  if (!/\.(tsx?|jsx?|mjs|cjs)$/.test(name)) return false;
  if (name.endsWith(".d.ts")) return false;
  const rel = relative(ROOT, fullPath).replaceAll("\\", "/").toLowerCase();
  if (rel.startsWith("components/ui/")) return false;
  if (rel.includes("/components/ui/")) return false;
  return true;
}

function scoreLogicFile(relPath) {
  const lower = relPath.replaceAll("\\", "/").toLowerCase();
  let score = 0;
  for (const kw of LOGIC_KEYWORDS) {
    if (lower.includes(kw)) score += 2;
  }
  for (const hint of LOGIC_NAME_HINTS) {
    if (lower.includes(hint)) score += 3;
  }
  if (lower.endsWith("/data.ts")) score += 5;
  if (lower.includes("app-shell")) score += 4;
  if (lower.includes("proxy.ts")) score += 4;
  return score;
}

async function pickMainLogicFiles() {
  const logicRoots = existsSync(join(ROOT, "src"))
    ? ["src"]
    : ["features", "lib", "app", "i18n", "."];

  const candidates = [];
  for (const rootRel of logicRoots) {
    const abs = join(ROOT, rootRel);
    if (!existsSync(abs)) continue;

    if (rootRel === ".") {
      for (const name of ["proxy.ts", "proxy.mjs"]) {
        const p = join(ROOT, name);
        if (existsSync(p)) candidates.push(p);
      }
      continue;
    }

    const files = await collectFilesRecursive(abs, isLogicCandidate);
    candidates.push(...files);
  }

  const unique = [...new Set(candidates)];
  const ranked = unique
    .map((full) => ({
      full,
      rel: relative(ROOT, full),
      score: scoreLogicFile(relative(ROOT, full)),
    }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || a.rel.localeCompare(b.rel, "en"));

  if (ranked.length === 0) {
    return unique
      .map((full) => ({ full, rel: relative(ROOT, full) }))
      .slice(0, MAX_LOGIC_FILES);
  }

  return ranked.slice(0, MAX_LOGIC_FILES);
}

async function readFileSafe(fullPath, maxBytes = 80_000) {
  try {
    const st = await stat(fullPath);
    if (st.size > maxBytes) {
      const content = await readFile(fullPath, "utf8");
      return `${content.slice(0, maxBytes)}\n\n/* … truncated (${st.size} bytes total) … */`;
    }
    return await readFile(fullPath, "utf8");
  } catch (err) {
    return `/* failed to read: ${err.message} */`;
  }
}

async function collectTypeDefinitions() {
  const paths = [];

  const srcDir = join(ROOT, "src");
  const typesDir = join(ROOT, "types");

  paths.push(...(await collectFilesRecursive(srcDir, isTypeDefinitionFile)));
  paths.push(...(await collectFilesRecursive(typesDir, isTypeDefinitionFile)));

  if (!existsSync(srcDir) && !existsSync(typesDir)) {
    for (const name of ["global.d.ts", "next-env.d.ts"]) {
      const p = join(ROOT, name);
      if (existsSync(p)) paths.push(p);
    }
  }

  return [...new Set(paths)].sort((a, b) => a.localeCompare(b, "en"));
}

function fenceLang(filePath) {
  if (filePath.endsWith(".tsx") || filePath.endsWith(".jsx")) return "tsx";
  if (filePath.endsWith(".json")) return "json";
  if (filePath.endsWith(".md")) return "markdown";
  return "typescript";
}

async function buildMarkdown() {
  const projectName = await readProjectName();
  const jst = formatJstNow();
  const treeRootLabel = relative(ROOT, ROOT) || ".";
  const treeBody = [
    `${treeRootLabel}${sep}`,
    ...(await buildTreeLines(ROOT)),
  ].join("\n");

  const depsJson = await readDependenciesBlock();

  const typePaths = await collectTypeDefinitions();
  let typesSection = "_（該当する型定義ファイルがありません）_\n";
  if (typePaths.length > 0) {
    const chunks = [];
    for (const full of typePaths) {
      const rel = relative(ROOT, full).replaceAll("\\", "/");
      const body = await readFileSafe(full);
      chunks.push(`### \`${rel}\`\n\n\`\`\`typescript\n${body.trimEnd()}\n\`\`\`\n`);
    }
    typesSection = chunks.join("\n");
  }

  const logicFiles = await pickMainLogicFiles();
  let logicSection = "_（該当する主要ロジックファイルがありません）_\n";
  if (logicFiles.length > 0) {
    const chunks = [];
    for (const item of logicFiles) {
      const rel =
        typeof item.rel === "string"
          ? item.rel.replaceAll("\\", "/")
          : relative(ROOT, item.full).replaceAll("\\", "/");
      const body = await readFileSafe(item.full ?? item);
      const lang = fenceLang(rel);
      chunks.push(`### \`${rel}\`\n\n\`\`\`${lang}\n${body.trimEnd()}\n\`\`\`\n`);
    }
    logicSection = chunks.join("\n");
  }

  return `# 本日のセッション前提コンテキスト

- **実行日時（JST）**: ${jst}
- **プロジェクト**: ${projectName}

## ディレクトリ構造（最大深度 ${MAX_TREE_DEPTH}）

\`\`\`text
${treeBody}
\`\`\`

## 主要依存ライブラリ

\`\`\`json
${depsJson}
\`\`\`

## 型定義（TypeScript / JSDoc）

${typesSection}

## 主要ロジックファイル

${logicSection}
`;
}

/** WSL: linux + microsoft/WSL in os.release() or /proc/version. */
function isWsl() {
  if (platform() !== "linux") return false;
  try {
    const rel = release().toLowerCase();
    if (rel.includes("microsoft") || rel.includes("wsl")) return true;
  } catch {
    /* ignore */
  }
  try {
    if (existsSync("/proc/version")) {
      const ver = readFileSync("/proc/version", "utf8").toLowerCase();
      if (ver.includes("microsoft") || ver.includes("wsl")) return true;
    }
  } catch {
    /* ignore */
  }
  return false;
}

function spawnPipeStdin(cmd, args, text) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      stdio: ["pipe", "ignore", "ignore"],
      windowsHide: true,
    });

    let settled = false;
    const finish = (ok) => {
      if (settled) return;
      settled = true;
      resolve(ok);
    };

    child.on("error", () => finish(false));
    child.stdin.on("error", () => finish(false));
    child.on("close", (code) => finish(code === 0));

    try {
      child.stdin.write(text, "utf8", () => {
        child.stdin.end();
      });
    } catch {
      finish(false);
    }
  });
}

function toWindowsPath(linuxPath) {
  return new Promise((resolve, reject) => {
    const child = spawn("wslpath", ["-w", linuxPath], {
      stdio: ["ignore", "pipe", "ignore"],
    });
    let out = "";
    child.stdout.on("data", (chunk) => {
      out += chunk;
    });
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0 && out.trim()) resolve(out.trim());
      else reject(new Error("wslpath failed"));
    });
  });
}

/**
 * WSL / Windows: UTF-8 temp file → PowerShell Set-Clipboard.
 * Stdin→$Input mojibakes Japanese under WSL pipes; clip.exe uses CP932 — both avoided.
 */
async function copyViaPowerShellUtf8(text) {
  const tmpPath = join(
    tmpdir(),
    `gemini-context-clip-${process.pid}-${Date.now()}.md`,
  );
  await writeFile(tmpPath, text, { encoding: "utf8" });

  try {
    let winPath = tmpPath;
    if (isWsl()) {
      winPath = await toWindowsPath(tmpPath);
    }
    const escaped = winPath.replace(/'/g, "''");
    const ok = await new Promise((resolve) => {
      const child = spawn(
        "powershell.exe",
        [
          "-NoProfile",
          "-Command",
          `Get-Content -LiteralPath '${escaped}' -Encoding UTF8 -Raw | Set-Clipboard`,
        ],
        {
          stdio: ["ignore", "ignore", "ignore"],
          windowsHide: true,
        },
      );
      child.on("error", () => resolve(false));
      child.on("close", (code) => resolve(code === 0));
    });
    return ok;
  } finally {
    await rm(tmpPath, { force: true }).catch(() => {});
  }
}

/**
 * Clipboard priority:
 *   macOS → pbcopy
 *   WSL → powershell.exe Set-Clipboard (UTF-8 via temp file)
 *   Windows native → powershell.exe Set-Clipboard (UTF-8 via temp file)
 *   other Linux → xclip / xsel
 */
async function copyToClipboard(text) {
  const os = platform();

  if (os === "darwin") {
    return spawnPipeStdin("pbcopy", [], text);
  }

  if (os === "win32" || isWsl()) {
    return copyViaPowerShellUtf8(text);
  }

  return spawnPipeStdin("sh", [
    "-c",
    "if command -v xclip >/dev/null 2>&1; then xclip -selection clipboard; elif command -v xsel >/dev/null 2>&1; then xsel --clipboard --input; else exit 127; fi",
  ], text);
}

async function main() {
  const markdown = await buildMarkdown();
  await writeFile(OUT_FILE, markdown, { encoding: "utf8" });

  const copied = await copyToClipboard(markdown);
  const relOut = relative(ROOT, OUT_FILE).replaceAll("\\", "/");

  if (copied) {
    console.log(`${relOut} に出力完了（クリップボードへコピーしました）`);
  } else {
    console.log(`${relOut} に出力完了（クリップボードへのコピーはスキップしました）`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
