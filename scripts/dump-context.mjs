#!/usr/bin/env node
/**
 * Generates gemini-context.md for Gemini session bootstrap (UTF-8, no BOM).
 * Prefer AppShell-reachable edit targets; demote / omit unmounted features.
 * Keep the dump prompt-sized: path map + short previews, not full source dumps.
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
const MAX_LOGIC_FILES = 8;
/** Full body only for these (small entry shells). Others get a short preview. */
const LOGIC_FULL_DUMP_RELS = new Set([
  "features/shell/components/app-shell.tsx",
  "features/network/components/network-view.tsx",
]);
const LOGIC_FULL_MAX_BYTES = 40_000;
const LOGIC_PREVIEW_MAX_BYTES = 2_500;
/** Under docs/: list dir name only (PDFs / bulky research assets omitted). */
const TREE_COLLAPSE_DIR_NAMES = new Set(["balcony-solar"]);
/** Skip binary / research blobs in the tree listing. */
const TREE_OMIT_EXTENSIONS = new Set([
  ".pdf",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".svg",
  ".ico",
  ".topojson",
]);

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
  "vendor",
  "tiles-test",
  "tippecanoe",
  // Nested leftover Next app — not part of living-energy-ui runtime
  "agri-dam-and-basin-grid",
]);

/**
 * Feature dirs under features/ that are not mounted from AppShell.
 * Omitted from the main tree and from "主要ロジック" dumps.
 */
const DEAD_FEATURE_DIRS = new Set([
  "basin-dam",
  "ecosystem",
  "ecosystem-orgs",
  "ranking",
]);

/** Paths (repo-relative, forward slashes) that must never be dumped as edit targets. */
const DEAD_PATH_PREFIXES = [
  "agri-dam-and-basin-grid/",
  "features/basin-dam/",
  "features/ecosystem/",
  "features/ecosystem-orgs/",
  "features/ranking/",
];

/**
 * Curated AppShell → file map (source of truth for Gemini path selection).
 * Keep in sync with features/shell/components/app-shell.tsx NAV_ITEMS.
 */
const I18N_PATHS = ["messages/ja.json", "messages/en.json"];

const EDIT_TARGET_MAP = [
  {
    viewId: "balcony-simulation",
    label: "ベランダ発電シミュレーション",
    entry: "features/balcony-pv/components/balcony-view.tsx",
    also: [
      "features/balcony-pv/simulator-data.ts",
      "features/balcony-pv/components/balcony-illustration.tsx",
      "features/living-sense/components/home-view.tsx (タブ living-sense)",
      "features/living-sense/data.ts",
      ...I18N_PATHS,
    ],
  },
  {
    viewId: "global-implementation",
    label: "ベランダソーラー世界実装",
    entry: "features/balcony-pv/components/world-implementation-view.tsx",
    also: [
      "features/balcony-pv/components/world-pv-map.tsx",
      "features/balcony-pv/data.ts",
      "features/balcony-pv/history-data.ts",
      "features/global-implementation/components/global-implementation-view.tsx (MajorVendorsListView / NonProfitOrgsListView のみ使用)",
      ...I18N_PATHS,
    ],
  },
  {
    viewId: "regional-network",
    label: "地域再エネネットワーク",
    entry: "features/network/components/network-view.tsx",
    also: [
      "features/network/components/japan-re-map.tsx",
      "features/network/components/network-detail-sidebar.tsx",
      "features/network/data.ts",
      ...I18N_PATHS,
    ],
  },
];

const NAMING_CAUTIONS = [
  "ナビ ID `global-implementation` の本体は `WorldImplementationView`（`features/balcony-pv/...`）。`GlobalImplementationView` 全体は未マウント。",
  "生活実感 `HomeView` はトップナビではなく `balcony-simulation` 内タブ。",
  "`features/basin-dam` / `ranking` / `ecosystem` / `ecosystem-orgs` は AppShell 未接続。明示依頼がない限り編集しない。",
  "AGENTS.md の旧5画面表より、本ファイルの「編集対象マップ」と `app-shell.tsx` を優先する。",
];

/**
 * Prefer these live entry files for full-text dump (order = priority).
 * Dead feature data.ts must not appear here.
 */
const LIVE_LOGIC_PRIORITY = [
  "features/shell/components/app-shell.tsx",
  "features/balcony-pv/components/balcony-view.tsx",
  "features/balcony-pv/components/world-implementation-view.tsx",
  "features/balcony-pv/simulator-data.ts",
  "features/balcony-pv/data.ts",
  "features/living-sense/data.ts",
  "features/network/components/network-view.tsx",
  "features/network/data.ts",
];

/** Major path listing (find . -maxdepth 4 equivalent). */
const MAJOR_FILE_MAX_DEPTH = 4;
const MAJOR_FILE_EXTENSIONS = new Set([
  ".js",
  ".mjs",
  ".html",
  ".css",
  ".json",
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

function toPosix(relPath) {
  return relPath.replaceAll("\\", "/");
}

function isDeadRelPath(relPath) {
  const rel = toPosix(relPath);
  return DEAD_PATH_PREFIXES.some(
    (prefix) => rel === prefix.slice(0, -1) || rel.startsWith(prefix),
  );
}

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

/**
 * @param {string} dir
 * @param {string} prefix
 * @param {number} depth
 * @param {string | null} parentRel posix path of parent relative to ROOT, or "" at root
 */
async function buildTreeLines(dir, prefix = "", depth = 0, parentRel = "") {
  if (depth >= MAX_TREE_DEPTH) return [];

  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const underFeatures = parentRel === "features";

  const visible = entries
    .filter((e) => !IGNORE_DIR_NAMES.has(e.name))
    .filter((e) => !e.name.startsWith(".") || e.name === ".env.example")
    .filter((e) => !(underFeatures && DEAD_FEATURE_DIRS.has(e.name)))
    .filter((e) => {
      if (e.isDirectory()) return true;
      const dot = e.name.lastIndexOf(".");
      if (dot < 0) return true;
      const ext = e.name.slice(dot).toLowerCase();
      if (TREE_OMIT_EXTENSIONS.has(ext)) return false;
      return true;
    })
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

    if (entry.isDirectory() && TREE_COLLAPSE_DIR_NAMES.has(entry.name)) {
      lines.push(
        `${prefix}${branch}${entry.name}/  (research assets omitted — not UI edit targets)`,
      );
      continue;
    }

    lines.push(`${prefix}${branch}${entry.name}${entry.isDirectory() ? sep : ""}`);

    if (entry.isDirectory()) {
      const childRel = parentRel
        ? `${parentRel}/${entry.name}`
        : entry.name;
      const sub = await buildTreeLines(
        join(dir, entry.name),
        prefix + childPrefix,
        depth + 1,
        childRel,
      );
      lines.push(...sub);
    }
  }
  return lines;
}

async function listDeadFeatureDirsPresent() {
  const featuresDir = join(ROOT, "features");
  if (!existsSync(featuresDir)) return [];
  let entries;
  try {
    entries = await readdir(featuresDir, { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isDirectory() && DEAD_FEATURE_DIRS.has(e.name))
    .map((e) => `features/${e.name}/`)
    .sort((a, b) => a.localeCompare(b, "en"));
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

/**
 * List existing major file paths (project-root relative), matching:
 * find . -maxdepth 4 -type f \( -name "*.js" -o ... \) excluding bulky/hidden dirs.
 */
async function collectMajorFilePaths() {
  const found = [];

  async function walk(current, depth) {
    if (depth > MAJOR_FILE_MAX_DEPTH) return;

    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      if (IGNORE_DIR_NAMES.has(entry.name)) continue;

      const full = join(current, entry.name);
      const rel = toPosix(relative(ROOT, full));

      if (entry.isDirectory()) {
        if (isDeadRelPath(`${rel}/`)) continue;
        await walk(full, depth + 1);
        continue;
      }

      if (!entry.isFile()) continue;
      if (isDeadRelPath(rel)) continue;

      const dot = entry.name.lastIndexOf(".");
      if (dot < 0) continue;
      const ext = entry.name.slice(dot).toLowerCase();
      if (!MAJOR_FILE_EXTENSIONS.has(ext)) continue;

      found.push(`./${rel}`);
    }
  }

  await walk(ROOT, 1);
  return found.sort((a, b) => a.localeCompare(b, "en"));
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
      const rel = toPosix(relative(ROOT, full));
      if (entry.isDirectory()) {
        if (isDeadRelPath(`${rel}/`)) continue;
        await walk(full);
      } else if (!isDeadRelPath(rel) && predicate(full, entry.name)) {
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
  const rel = toPosix(relative(ROOT, fullPath)).toLowerCase();
  if (rel.startsWith("components/ui/")) return false;
  if (rel.includes("/components/ui/")) return false;
  if (isDeadRelPath(rel)) return false;
  return true;
}

function scoreLogicFile(relPath) {
  const lower = toPosix(relPath).toLowerCase();
  if (isDeadRelPath(lower)) return -1000;

  let score = 0;
  const priorityIdx = LIVE_LOGIC_PRIORITY.findIndex(
    (p) => p.toLowerCase() === lower,
  );
  if (priorityIdx >= 0) {
    score += 1000 - priorityIdx * 10;
  }

  for (const kw of LOGIC_KEYWORDS) {
    if (lower.includes(kw)) score += 2;
  }
  for (const hint of LOGIC_NAME_HINTS) {
    if (lower.includes(hint)) score += 3;
  }
  if (lower.endsWith("/data.ts")) score += 5;
  if (lower.includes("app-shell")) score += 4;
  if (lower.includes("proxy.ts")) score += 4;
  // Prefer live view entry points over orphan data dumps
  if (lower.includes("world-implementation-view")) score += 20;
  if (lower.includes("balcony-view")) score += 18;
  if (lower.includes("simulator-data")) score += 16;
  if (lower.includes("network-view")) score += 14;
  return score;
}

async function pickMainLogicFiles() {
  const preferred = [];
  for (const rel of LIVE_LOGIC_PRIORITY) {
    const full = join(ROOT, ...rel.split("/"));
    if (existsSync(full)) {
      preferred.push({ full, rel, score: scoreLogicFile(rel) });
    }
  }

  if (preferred.length >= MAX_LOGIC_FILES) {
    return preferred.slice(0, MAX_LOGIC_FILES);
  }

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

  const preferredRels = new Set(preferred.map((p) => p.rel));
  const unique = [...new Set(candidates)];
  const ranked = unique
    .map((full) => ({
      full,
      rel: toPosix(relative(ROOT, full)),
      score: scoreLogicFile(relative(ROOT, full)),
    }))
    .filter((x) => x.score > 0 && !preferredRels.has(x.rel) && !isDeadRelPath(x.rel))
    .sort((a, b) => b.score - a.score || a.rel.localeCompare(b.rel, "en"));

  return [...preferred, ...ranked].slice(0, MAX_LOGIC_FILES);
}

async function readFileSafe(fullPath, maxBytes = LOGIC_FULL_MAX_BYTES) {
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

async function describeLogicFile(fullPath, rel) {
  try {
    const st = await stat(fullPath);
    const content = await readFile(fullPath, "utf8");
    const lineCount = content.split(/\r?\n/).length;
    const fullDump = LOGIC_FULL_DUMP_RELS.has(rel);
    const maxBytes = fullDump ? LOGIC_FULL_MAX_BYTES : LOGIC_PREVIEW_MAX_BYTES;
    let body = content;
    let note = "";
    if (content.length > maxBytes) {
      body = content.slice(0, maxBytes);
      note = fullDump
        ? `\n\n/* … truncated (${st.size} bytes, ${lineCount} lines) … */`
        : `\n\n/* … preview only (${st.size} bytes, ${lineCount} lines). Cursor must Read the file; do not treat this snippet as source of truth. … */`;
    } else if (!fullDump) {
      note = `\n\n/* preview complete (${st.size} bytes, ${lineCount} lines) */`;
    }
    return {
      rel,
      fullPath,
      size: st.size,
      lineCount,
      fullDump,
      body: body + note,
    };
  } catch (err) {
    return {
      rel,
      fullPath,
      size: 0,
      lineCount: 0,
      fullDump: false,
      body: `/* failed to read: ${err.message} */`,
    };
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

function buildEditTargetSection() {
  const lines = [
    "AppShell（`features/shell/components/app-shell.tsx`）のナビは次の **3画面のみ**。",
    "UI 変更の話が出たら、View ID → entry のパスだけを編集候補にする。",
    "",
  ];

  for (const item of EDIT_TARGET_MAP) {
    lines.push(`### \`${item.viewId}\` — ${item.label}`);
    lines.push("");
    lines.push(`- **entry（必須）**: \`${item.entry}\``);
    if (item.also?.length) {
      lines.push("- **関連（必要時のみ）**:");
      for (const a of item.also) {
        lines.push(`  - \`${a}\``);
      }
    }
    lines.push("");
  }

  lines.push("### 命名の注意（取り違え防止）");
  lines.push("");
  for (const c of NAMING_CAUTIONS) {
    lines.push(`- ${c}`);
  }
  lines.push("");

  return lines.join("\n");
}

function buildDeadSection(deadFeatureDirs) {
  const lines = [
    "次はリポジトリに残っているが **AppShell から未接続**。",
    "明示的な復活依頼がない限り、パス指定・編集対象にしない。",
    "",
  ];

  if (deadFeatureDirs.length > 0) {
    lines.push("```text");
    for (const d of deadFeatureDirs) {
      lines.push(d);
    }
    if (existsSync(join(ROOT, "agri-dam-and-basin-grid"))) {
      lines.push("agri-dam-and-basin-grid/  (ネストされた別アプリ・ダンプ対象外)");
    }
    lines.push("```");
    lines.push("");
  } else {
    lines.push("_（未接続 feature ディレクトリなし）_");
    lines.push("");
  }

  return lines.join("\n");
}

/** Session-bootstrap rules (pasted at the start of a Gemini thread). */
function buildSessionBootstrapSection() {
  return `このファイルは **本日のセッション開始用コード地図** です。特定タスク用の出力フォーマットではない。

- パス選定の正本は下の「編集対象マップ」。ツリーやプレビューよりマップを優先する。
- UI は AppShell の **3画面のみ**（\`balcony-simulation\` / \`global-implementation\` / \`regional-network\`）。
- 「未接続」に挙げたパスは、明示的な復活依頼がない限り提案・編集対象にしない。
- 命名の取り違えに注意（マップ内の注意書きを正とする）。特にナビ ID \`global-implementation\` の本体は \`WorldImplementationView\`（\`features/balcony-pv/...\`）。
- このダンプ内のソースプレビューは断片にすぎない。実装の正本はリポジトリ上の実ファイル。
- 具体的な改修タスクが来たら、「編集対象マップ」からパスを選び、Cursor には **Read してから編集** するよう指示する。プレビューを鵜呑みに書き換えない。
- ユーザー向け文言は \`messages/{ja,en}.json\`。トーンは \`.cursorrules\`（ダーク×エメラルド）。
- Cursor への依頼文の書き方例は、必要になったとき末尾の「参考」を見る（毎回この形式で答えなくてよい）。
`;
}

/** Optional appendix — only when turning a concrete task into a Cursor prompt. */
function buildCursorPromptReferenceSection() {
  return `_タスクが具体化したとき用。セッション開始直後からこの形式で返答する必要はない。_

\`\`\`markdown
## Task
<日本語で 1〜3 文。何をどう変えるか>

## View
\`<viewId>\` — <ラベル>

## Edit (only these)
- \`<entry path>\` （必須）
- \`<related path>\` （必要なときだけ。messages/{ja,en}.json は文言変更時）

## Do not edit
- features/basin-dam/**
- features/ranking/**
- features/ecosystem/**
- features/ecosystem-orgs/**
- agri-dam-and-basin-grid/**

## Cursor instructions
- 列挙したパスを Read してから編集する。このコンテキストのプレビュー断片を正本にしない。
- ユーザー向け文言は messages/{ja,en}.json を優先する。
- .cursorrules / 既存トーン（ダーク×エメラルド）を崩さない。
- 未接続 feature を復活させない。新規ルートを増やさない。
\`\`\`
`;
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
  const deadFeatureDirs = await listDeadFeatureDirsPresent();

  const majorPaths = await collectMajorFilePaths();
  const majorPathsBody =
    majorPaths.length > 0 ? majorPaths.join("\n") : "(該当ファイルなし)";

  const typePaths = await collectTypeDefinitions();
  let typesSection = "_（該当する型定義ファイルがありません）_\n";
  if (typePaths.length > 0) {
    const chunks = [];
    for (const full of typePaths) {
      const rel = toPosix(relative(ROOT, full));
      const body = await readFileSafe(full);
      chunks.push(`### \`${rel}\`\n\n\`\`\`typescript\n${body.trimEnd()}\n\`\`\`\n`);
    }
    typesSection = chunks.join("\n");
  }

  const logicFiles = await pickMainLogicFiles();
  let logicSection = "_（該当するエントリ参照がありません）_\n";
  if (logicFiles.length > 0) {
    const indexLines = [
      "巨大ソースの全文は載せない。パス選定用の短いプレビューのみ。",
      "Cursor は必ず実ファイルを Read すること。",
      "",
      "| path | lines | bytes | dump |",
      "| --- | ---: | ---: | --- |",
    ];
    const chunks = [];
    for (const item of logicFiles) {
      const rel =
        typeof item.rel === "string"
          ? toPosix(item.rel)
          : toPosix(relative(ROOT, item.full));
      const described = await describeLogicFile(item.full ?? item, rel);
      const mode = described.fullDump ? "full" : "preview";
      indexLines.push(
        `| \`${rel}\` | ${described.lineCount} | ${described.size} | ${mode} |`,
      );
      const lang = fenceLang(rel);
      chunks.push(
        `### \`${rel}\` (${mode}, ${described.lineCount} lines)\n\n\`\`\`${lang}\n${described.body.trimEnd()}\n\`\`\`\n`,
      );
    }
    logicSection = `${indexLines.join("\n")}\n\n${chunks.join("\n")}`;
  }

  const editTargets = buildEditTargetSection();
  const deadSection = buildDeadSection(deadFeatureDirs);
  const sessionBootstrap = buildSessionBootstrapSection();
  const cursorPromptRef = buildCursorPromptReferenceSection();

  return `# 本日のセッション前提コンテキスト

- **実行日時（JST）**: ${jst}
- **プロジェクト**: ${projectName}
- **用途**: Gemini 新規スレッド開始時に貼るコード地図（特定タスクの出力強制ではない）
- **ダンプ方針**: パス選定用にスリム化。AppShell 到達可能のみ。未接続 feature / PDF 研究資産 / ネスト別アプリは本文ダンプしない。巨大 TSX はプレビューのみ。

## セッション運用（このスレッドの前提）

${sessionBootstrap}

## 編集対象マップ（正・パス指定はここから）

${editTargets}

## 未接続（既定で編集しない）

${deadSection}

## ディレクトリ構造（最大深度 ${MAX_TREE_DEPTH}・生きている feature のみ）

\`\`\`text
${treeBody}
\`\`\`

## 存在する主要ファイル一覧（プロジェクトルート基準）

\`\`\`text
${majorPathsBody}
\`\`\`

## 主要依存ライブラリ

\`\`\`json
${depsJson}
\`\`\`

## 型定義（TypeScript / JSDoc）

${typesSection}

## エントリ参照（到達可能・プレビュー優先）

${logicSection}

## 参考：Cursor 依頼の書き方例（タスク具体化時のみ）

${cursorPromptRef}
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
