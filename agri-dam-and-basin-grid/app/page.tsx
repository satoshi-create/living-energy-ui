'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  Bell,
  ChevronRight,
  CloudRain,
  Droplets,
  Gauge,
  Grid3X3,
  Leaf,
  Menu,
  Radio,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Sprout,
  Sun,
  Waves,
  Zap,
  X,
} from 'lucide-react'

const nodes = [
  { id: 'A', name: '上流貯水池', type: '貯水池', x: 100, y: 82, capacity: 82, level: 64, status: 'normal' },
  { id: 'B', name: '北部水田群', type: '圃場群', x: 100, y: 220, capacity: 68, level: 46, status: 'normal' },
  { id: 'C', name: '第1分水工', type: '分水工', x: 310, y: 150, capacity: 92, level: 58, status: 'normal' },
  { id: 'D', name: '中央調整池', type: '調整池', x: 520, y: 150, capacity: 76, level: 61, status: 'watch' },
  { id: 'E', name: '南部排水機場', type: '排水機場', x: 730, y: 150, capacity: 89, level: 38, status: 'normal' },
  { id: 'F', name: '沿岸放流口', type: '放流口', x: 930, y: 150, capacity: 95, level: 24, status: 'normal' },
]

const fields = [
  ['北部第1圃場', '稲作', '排水準備', 72, 'normal'],
  ['北部第2圃場', '稲作', '監視中', 61, 'watch'],
  ['中央第3圃場', '大豆', '排水準備', 48, 'normal'],
  ['南部第1圃場', '野菜', '排水完了', 22, 'done'],
]

function StatusDot({ status }: { status: string }) {
  return <span className={`status-dot ${status}`} aria-label={status === 'normal' ? '正常' : status === 'watch' ? '注意' : '完了'} />
}

function MiniChart() {
  return (
    <svg viewBox="0 0 500 130" className="mini-chart" role="img" aria-label="24時間の発電量グラフ">
      <path d="M0 108 C35 104 38 82 72 88 S110 65 143 76 S180 52 212 68 S246 26 280 50 S319 45 348 60 S385 30 416 44 S454 22 500 32 L500 130 L0 130Z" fill="var(--chart-fill)" />
      <path d="M0 108 C35 104 38 82 72 88 S110 65 143 76 S180 52 212 68 S246 26 280 50 S319 45 348 60 S385 30 416 44 S454 22 500 32" fill="none" stroke="var(--primary)" strokeWidth="3" />
    </svg>
  )
}

export default function Page() {
  const [activeTab, setActiveTab] = useState('監視ダッシュボード')
  const [rain, setRain] = useState(28)
  const [selected, setSelected] = useState<(typeof nodes)[number] | null>(null)
  const [notice, setNotice] = useState('')
  const factor = rain / 80
  const systemStatus = rain > 58 ? '警戒' : rain > 38 ? '注意' : '正常'
  const adjustedNodes = useMemo(() => nodes.map((node) => ({ ...node, level: Math.min(99, Math.round(node.level + factor * (100 - node.level) * 0.56)) })), [factor])

  const showNotice = (text: string) => { setNotice(text); window.setTimeout(() => setNotice(''), 2600) }

  return (
    <main className="console-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark"><Waves size={20} /></div><div><strong>AgriDam</strong><span>BASIN GRID</span></div></div>
        <div className="side-label">OPERATIONS</div>
        <nav className="side-nav" aria-label="メインナビゲーション">
          {[
            [Activity, '監視ダッシュボード'], [Grid3X3, '圃場管理'], [BatteryCharging, 'エネルギー管理'], [ShieldCheck, '市民向けサマリー'],
          ].map(([Icon, label]) => <button key={label as string} className={activeTab === label ? 'active' : ''} onClick={() => setActiveTab(label as string)}><Icon size={17} />{label as string}{activeTab === label && <ChevronRight size={14} className="nav-arrow" />}</button>)}
        </nav>
        <div className="side-bottom"><button><Settings2 size={17} />システム設定</button><div className="operator"><span className="avatar">OP</span><div><strong>運用チーム</strong><small>オンライン</small></div><span className="online" /></div></div>
      </aside>

      <section className="workspace">
        <header className="topbar"><button className="mobile-menu" aria-label="メニュー"><Menu size={20} /></button><div><div className="eyebrow">AGRICULTURAL WATER CONTROL CENTER</div><h1>{activeTab}</h1></div><div className="top-actions"><div className="system-pill"><StatusDot status={systemStatus === '正常' ? 'normal' : 'watch'} />システム {systemStatus}</div><button className="icon-button" aria-label="通知"><Bell size={18} /><i /></button><span className="top-date">2024.08.24　14:32 JST</span></div></header>

        {activeTab === '監視ダッシュボード' && <>
          <section className="kpi-row">
            <div className="kpi"><div className="kpi-icon cyan"><Droplets size={18} /></div><span>総貯水量</span><strong>18.4 <small>百万m³</small></strong><em>+4.2% <span>vs 前日</span></em></div>
            <div className="kpi"><div className="kpi-icon blue"><CloudRain size={18} /></div><span>降雨強度</span><strong>{rain} <small>mm/h</small></strong><em className={rain > 38 ? 'warning-text' : ''}>{rain > 38 ? '注意レベル' : '平常レベル'}</em></div>
            <div className="kpi"><div className="kpi-icon green"><Sprout size={18} /></div><span>管理圃場</span><strong>24 <small>圃場</small></strong><em>全圃場稼働中</em></div>
            <div className="kpi"><div className="kpi-icon orange"><Zap size={18} /></div><span>本日の発電量</span><strong>6,842 <small>kWh</small></strong><em>+12.8% <span>vs 前日</span></em></div>
          </section>
          <section className="control-strip"><div className="strip-title"><SlidersHorizontal size={16} />降雨シミュレーション</div><div className="rain-slider"><input type="range" min="0" max="80" value={rain} onChange={(e) => setRain(Number(e.target.value))} aria-label="降雨強度" /><div className="range-labels"><span>0 mm/h</span><strong>{rain} mm/h</strong><span>80 mm/h</span></div></div><div className={`alert-status ${systemStatus === '正常' ? 'ok' : ''}`}><AlertTriangle size={16} />{rain > 58 ? '排水能力の確認が必要です' : rain > 38 ? '一部圃場で注意が必要です' : '全系統は安定しています'}</div></section>
          <div className="content-grid">
            <section className="panel network-panel"><div className="panel-header"><div><div className="panel-kicker"><Radio size={14} />LIVE NETWORK</div><h2>流域ネットワーク</h2></div><span className="updated">最終更新 14:31:48</span></div><div className="dag-wrap"><svg viewBox="0 0 1030 300" className="dag" aria-label="流域ネットワーク図">
              {adjustedNodes.slice(0, -1).map((node, i) => <line key={node.id} x1={node.x + 75} y1={node.y + 18} x2={adjustedNodes[i + 1].x - 12} y2={adjustedNodes[i + 1].y + 18} className="flow-line" />)}
              {adjustedNodes.map((node) => <g key={node.id} className="dag-node" onClick={() => setSelected(node)} tabIndex={0} role="button"><rect x={node.x - 12} y={node.y - 22} width="150" height="78" rx="8" className="node-box" /><circle cx={node.x + 9} cy={node.y - 1} r="17" className="node-circle" /><text x={node.x + 9} y={node.y + 5} textAnchor="middle" className="node-id">{node.id}</text><text x={node.x + 34} y={node.y - 2} className="node-name">{node.name}</text><text x={node.x + 34} y={node.y + 18} className="node-type">{node.type}</text><rect x={node.x + 34} y={node.y + 29} width="85" height="5" rx="2" className="level-track" /><rect x={node.x + 34} y={node.y + 29} width={85 * node.level / 100} height="5" rx="2" className="level-fill" /><text x={node.x + 125} y={node.y + 34} className="level-text">{node.level}%</text><StatusDot status={node.status} /> </g>)}
            </svg></div><div className="legend"><span><StatusDot status="normal" />正常</span><span><StatusDot status="watch" />注意</span><span><span className="line-key" />水流方向</span><span className="legend-help">ノードを選択して詳細を表示</span></div></section>
            <section className="panel alert-panel"><div className="panel-header"><div><div className="panel-kicker"><Bell size={14} />SYSTEM ALERTS</div><h2>アラート & 通知</h2></div><span className="count-badge">3</span></div><div className="alerts"><div className="alert-item critical"><AlertTriangle size={17} /><div><strong>中央調整池 水位上昇</strong><p>現在水位 61% — 監視を継続してください</p><small>2分前</small></div></div><div className="alert-item"><CloudRain size={17} /><div><strong>降雨予測が更新されました</strong><p>今後3時間の予測雨量 42mm</p><small>18分前</small></div></div><div className="alert-item info"><Gauge size={17} /><div><strong>第1分水工の流量が安定</strong><p>毎秒 12.4m³ — 正常範囲内</p><small>32分前</small></div></div></div><button className="text-action">すべての通知を見る <ChevronRight size={14} /></button></section>
          </div>
          <section className="lower-grid"><div className="panel table-panel"><div className="panel-header"><div><div className="panel-kicker"><Leaf size={14} />FIELD STATUS</div><h2>圃場ステータス</h2></div><button className="text-action" onClick={() => setActiveTab('圃場管理')}>圃場管理を開く <ChevronRight size={14} /></button></div><div className="table-scroll"><table><thead><tr><th>圃場名</th><th>作物</th><th>状態</th><th>含水率</th><th>更新</th></tr></thead><tbody>{fields.map(([name, crop, status, moisture, tone]) => <tr key={name}><td><span className="field-glyph"><Sprout size={14} /></span>{name}</td><td>{crop}</td><td><span className={`tag ${tone}`}>{status}</span></td><td><div className="moisture"><span style={{ width: `${moisture}%` }} /><b>{moisture}%</b></div></td><td className="muted">14:28</td></tr>)}</tbody></table></div></div><div className="panel power-panel"><div className="panel-header"><div><div className="panel-kicker"><Sun size={14} />ENERGY OUTPUT</div><h2>発電・蓄電</h2></div><span className="live-label"><i /> LIVE</span></div><div className="energy-total"><strong>6,842</strong><span>kWh</span><em>+12.8%</em></div><MiniChart /><div className="energy-meta"><span>蓄電池 <b>78%</b></span><span>今日の目標 <b>82%</b></span></div></div></section>
        </>}

        {activeTab === '圃場管理' && <section className="single-view"><div className="view-hero"><div><div className="panel-kicker"><Grid3X3 size={14} />FIELD OPERATIONS</div><h2>圃場管理</h2><p>流域内24圃場の排水・含水率を一元管理します。</p></div><button className="primary-button" onClick={() => showNotice('全圃場へ事前排水指示を送信しました')}><Droplets size={16} />一括事前排水</button></div><div className="field-cards">{fields.concat([['南部第2圃場', '麦', '監視中', 57, 'watch'], ['中央第1圃場', '稲作', '排水完了', 19, 'done']]).map(([name, crop, status, moisture, tone]) => <div className="field-card" key={name}><div className="field-card-top"><span className="field-glyph"><Sprout size={16} /></span><StatusDot status={tone === 'done' ? 'normal' : tone} /></div><h3>{name}</h3><span className="crop-label">{crop}</span><div className="card-moisture"><span>土壌含水率</span><strong>{moisture}%</strong></div><div className="moisture wide"><span style={{ width: `${moisture}%` }} /></div><span className={`tag ${tone}`}>{status}</span></div>)}</div></section>}
        {activeTab === 'エネルギー管理' && <section className="single-view"><div className="view-hero"><div><div className="panel-kicker"><BatteryCharging size={14} />ENERGY CONTROL</div><h2>エネルギー管理</h2><p>太陽光発電と蓄電池の稼働状況を監視します。</p></div></div><div className="energy-cards"><div className="energy-big"><Sun size={24} /><span>本日の発電量</span><strong>6,842 <small>kWh</small></strong><MiniChart /></div><div className="energy-big"><BatteryCharging size={24} /><span>蓄電池残量</span><strong>78 <small>%</small></strong><div className="battery-bar"><span /></div><p>使用可能容量 312 kWh</p></div><div className="energy-big"><Zap size={24} /><span>現在の出力</span><strong>284 <small>kW</small></strong><p className="positive">系統への供給中</p></div></div></section>}
        {activeTab === '市民向けサマリー' && <section className="single-view public-view"><div className="public-badge"><ShieldCheck size={18} />公開情報</div><h2>流域の安全状況</h2><p>現在、AgriDam管理区域の水位・排水設備は安定しています。</p><div className="public-status"><StatusDot status="normal" /><strong>正常</strong><span>最終更新：14:31</span></div><div className="public-stats"><div><Droplets size={20} /><span>河川水位</span><strong>安全</strong></div><div><CloudRain size={20} /><span>降雨状況</span><strong>{rain} mm/h</strong></div><div><ShieldCheck size={20} /><span>排水設備</span><strong>稼働中</strong></div></div></section>}
      </section>
      {notice && <div className="toast-notice"><ShieldCheck size={17} />{notice}<button onClick={() => setNotice('')} aria-label="閉じる"><X size={15} /></button></div>}
      {selected && <div className="sheet-backdrop" onClick={() => setSelected(null)}><aside className="detail-sheet" onClick={(e) => e.stopPropagation()}><button className="close-sheet" onClick={() => setSelected(null)} aria-label="閉じる"><X size={18} /></button><div className="panel-kicker">NODE DETAILS / {selected.id}</div><h2>{selected.name}</h2><p className="sheet-type">{selected.type}</p><div className="detail-status"><StatusDot status={selected.status} />{selected.status === 'normal' ? '正常稼働' : '注意して監視'}</div><div className="detail-metric"><span>現在水位</span><strong>{selected.level}%</strong><div className="progress-line"><i style={{ width: `${selected.level}%` }} /></div></div><div className="detail-metric"><span>処理能力</span><strong>{selected.capacity}%</strong><div className="progress-line"><i style={{ width: `${selected.capacity}%` }} /></div></div><div className="sheet-note"><Activity size={16} /><span>流量は直近15分間安定しています。<small>自動監視中</small></span></div></aside></div>}
    </main>
  )
}
