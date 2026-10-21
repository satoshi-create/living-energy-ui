"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Ecosystem3DViewer } from "./ecosystem-3d/ecosystem-3d-viewer";

export type EcosystemModelId = "direct-plugin" | "storage-hybrid" | "offgrid-standalone";

interface EcosystemModelData {
  id: EcosystemModelId;
  titleKey: string;
  badgeKey: string;
  summaryKey: string;
  generation: string;
  consumption: string;
  gridFeedback: string;
  hardware: {
    panel: string;
    inverter: string;
    connection: string;
  };
  regulations: string[];
}

const ECOSYSTEM_MODELS: Record<EcosystemModelId, EcosystemModelData> = {
  "direct-plugin": {
    id: "direct-plugin",
    titleKey: "① コンセント直結型（系統連系）",
    badgeKey: "公認プラグイン方式",
    summaryKey: "ベランダの発電を壁コンセントへ直挿し。家電で自家消費し、余剰は自動で電力網へ還元。",
    generation: "600W〜800W",
    consumption: "200W〜300W（待機電力相殺）",
    gridFeedback: "最大 500W 自動売電",
    hardware: {
      panel: "軽量フレキシブル / 剛体ソーラー (600W〜800W)",
      inverter: "マイクロインバータ (800W上限・系統保護リレー内蔵)",
      connection: "230V/100V 壁コンセント直挿し (工事不要)",
    },
    regulations: [
      "電気工事士の立ち会い資格・工事が一切不要",
      "各国の公認上限規格（EU 800W等）に自動適応",
      "逆潮流（双方向）対応スマートメーター推奨",
    ],
  },
  "storage-hybrid": {
    id: "storage-hybrid",
    titleKey: "② 蓄電ハイブリッド型（直結制限対策）",
    badgeKey: "蓄電自給方式",
    summaryKey: "系統への直結が制限される環境向け。昼間にバッテリーへ充電し、夜間や専用コンセントへ自給。",
    generation: "400W〜800W",
    consumption: "300W〜500W（専用回路給電）",
    gridFeedback: "0W（逆潮流防止・完全自給）",
    hardware: {
      panel: "高効率パネル (400W〜800W)",
      inverter: "ハイブリッド充電コントローラー ＋ ACインバータ",
      connection: "ポータブル電源 / 据置バッテリー直結",
    },
    regulations: [
      "系統側へ電力を逆流させないため法的規制をクリア",
      "停電時・非常時の独立バックアップ電源として機能",
      "直結禁止国・集合住宅でも導入可能",
    ],
  },
  "offgrid-standalone": {
    id: "offgrid-standalone",
    titleKey: "③ 独立電源型（完全オフグリッド）",
    badgeKey: "生活自給方式",
    summaryKey: "送電網のない山間部や未整備地域向け。パネルと蓄電池のみで生活インフラを支える自律型給電。",
    generation: "200W〜600W",
    consumption: "100W〜200W（LED照明・通信・小型冷蔵庫）",
    gridFeedback: "送電網なし（完全自給）",
    hardware: {
      panel: "自立型・出仕舞い対応ソーラー (200W〜600W)",
      inverter: "DC/DC コントローラー ＋ 蓄電セル",
      connection: "DC機器直結 / USB-C / 小型AC",
    },
    regulations: [
      "送電インフラへの接続義務・認可手続きが不要",
      "分散型マイクログリッドとして単独自律運用",
      "過酷環境下での防塵・防水規格準拠",
    ],
  },
};

export function Ecosystem3DFullView() {
  const [activeModelId, setActiveModelId] = useState<EcosystemModelId>("direct-plugin");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const model = ECOSYSTEM_MODELS[activeModelId];

  return (
    <div className="flex flex-col h-[calc(100vh-130px)] min-h-[640px] space-y-4">
      {/* 上部バー：形態選択タブ ＆ 右側サイドバー開閉トグル */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/40 p-2 rounded-xl border border-slate-800/80 shrink-0">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(ECOSYSTEM_MODELS) as EcosystemModelId[]).map((id) => {
            const isActive = activeModelId === id;
            return (
              <button
                key={id}
                onClick={() => setActiveModelId(id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 font-semibold"
                    : "bg-slate-900/80 text-slate-300 border border-slate-700/60 hover:text-slate-100 hover:border-slate-600"
                }`}
              >
                {ECOSYSTEM_MODELS[id].titleKey}
              </button>
            );
          })}
        </div>

        {/* サイドバートグルボタン（建築詳細ビュー準拠のシャープなアイコン） */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-slate-900/80 border border-slate-700/60 text-slate-400 hover:text-slate-100 hover:border-slate-500 transition shrink-0"
          title={isSidebarOpen ? "サイドパネルを閉じる" : "サイドパネルを開く"}
          aria-label="Toggle Sidebar"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
            <path d="M15 3v18" strokeWidth="2" />
            {isSidebarOpen ? (
              <path d="M11 9l3 3-3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M13 9l-3 3 3 3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </button>
      </div>

      {/* 左右分割メインビュー（全高フィット & 内部スクロール） */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 overflow-hidden">
        {/* 左側: メイン3Dビューポート */}
        <div className="flex-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl relative overflow-hidden flex flex-col min-h-0">
          {/* 3Dヘッダーオーバーレイ */}
          <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur border border-slate-800 px-4 py-2.5 rounded-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
              {model.badgeKey}
            </span>
            <span className="text-sm font-medium text-slate-200">
              {model.titleKey}
            </span>
          </div>

          {/* 3Dキャンバス領域（Three.js / React Three Fiber レンダリング） */}
          <div className="flex-1 min-h-0 relative w-full h-full">
            <Ecosystem3DViewer modelId={activeModelId} />
          </div>

          {/* 3D下部ステータスバー */}
          <div className="bg-slate-900/90 border-t border-slate-800/80 px-6 py-3 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              <span className="text-slate-300 font-medium">電力循環シミュレーション稼働中</span>
            </div>
            <span>ドラッグで視点回転 / スクロールでズーム</span>
          </div>
        </div>

        {/* 右側: サイドパネル（開閉トグル連動 & スクロール対応） */}
        {isSidebarOpen && (
          <aside className="w-full lg:w-[380px] shrink-0 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* モデル要約カード */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Overview
              </span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {model.summaryKey}
              </p>
            </div>

            {/* 需給バランス・数値カード */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-4 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Power Metrics
              </span>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">日中想定発電量</span>
                  <span className="text-sm font-semibold text-emerald-400">{model.generation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">ベース自家消費</span>
                  <span className="text-sm font-semibold text-slate-200">{model.consumption}</span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
                  <span className="text-xs text-slate-400">系統還元 / 蓄電</span>
                  <span className="text-sm font-semibold text-sky-400">{model.gridFeedback}</span>
                </div>
              </div>
            </div>

            {/* ハードウェア構成カード */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Hardware Architecture
              </span>
              <ul className="space-y-2.5 text-xs">
                <li className="flex flex-col gap-0.5">
                  <span className="text-slate-400">太陽光パネル</span>
                  <span className="text-slate-200 font-medium">{model.hardware.panel}</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="text-slate-400">インバータ/変換</span>
                  <span className="text-slate-200 font-medium">{model.hardware.inverter}</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="text-slate-400">受電・接続方式</span>
                  <span className="text-emerald-300 font-medium">{model.hardware.connection}</span>
                </li>
              </ul>
            </div>

            {/* 法規・運用ルールカード */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                Regulatory & Safety
              </span>
              <ul className="space-y-2 text-xs text-slate-300">
                {model.regulations.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0"></span>
                    <span className="leading-relaxed">{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
