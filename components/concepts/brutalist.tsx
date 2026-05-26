"use client"

import { useState } from "react"
import { Shield, AlertTriangle, Zap, ChevronRight, ExternalLink, Activity } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine } from "recharts"

const priceData = [
  { time: "00:00", price: 2100, il: -1.2 },
  { time: "04:00", price: 2150, il: -1.8 },
  { time: "08:00", price: 2080, il: -0.9 },
  { time: "12:00", price: 2200, il: -2.4 },
  { time: "16:00", price: 2180, il: -2.1 },
  { time: "20:00", price: 2250, il: -3.2 },
  { time: "24:00", price: 2300, il: -3.8 },
]

const positions = [
  { id: 1, pair: "ETH/USDC", value: "$45,230", il: "-$892", ilPercent: "-1.97%", fees: "+$1,245", status: "UNPROTECTED" },
  { id: 2, pair: "WBTC/ETH", value: "$32,100", il: "-$456", ilPercent: "-1.42%", fees: "+$890", status: "PROTECTED" },
  { id: 3, pair: "ARB/ETH", value: "$12,500", il: "-$234", ilPercent: "-1.87%", fees: "+$456", status: "UNPROTECTED" },
]

export function BrutalistDashboard() {
  const [priceChange, setPriceChange] = useState(25)

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e5e5e5] font-mono">
      <div className="p-6 pt-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-6 border-b-4 border-[#ff6b35]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#ff6b35] flex items-center justify-center">
              <Shield className="w-8 h-8 text-black" strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-4xl font-black tracking-tighter uppercase">SHIELDLP</h1>
              <p className="text-xs text-[#666] tracking-[0.3em] uppercase">// Protege tu liquidez. Hedgea tus pools.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-2 border-[#333]">
              <div className="w-3 h-3 bg-[#22c55e] animate-pulse" />
              <span className="text-xs tracking-wider">MAINNET</span>
            </div>
            <button className="flex items-center gap-3 px-5 py-3 bg-[#ff6b35] text-black font-bold uppercase tracking-wider hover:bg-[#ff8555] transition-colors">
              <span>0x7a3d...8f2e</span>
              <div className="w-4 h-4 border-2 border-black" />
            </button>
          </div>
        </header>

        {/* Warning Banner */}
        <div className="mb-8 p-4 bg-[#ff6b35]/10 border-l-4 border-[#ff6b35] flex items-center gap-4">
          <AlertTriangle className="w-6 h-6 text-[#ff6b35]" />
          <div className="flex-1">
            <p className="text-sm font-bold text-[#ff6b35] uppercase tracking-wider">// ALERTA DE RIESGO</p>
            <p className="text-xs text-[#888]">2 posiciones sin cobertura con IL {'>'} 1.5%. Considera activar protección.</p>
          </div>
          <button className="px-4 py-2 bg-[#ff6b35] text-black font-bold text-xs uppercase tracking-wider">
            VER DETALLES
          </button>
        </div>

        {/* Stats Grid - Brutalist Style */}
        <div className="grid grid-cols-4 gap-0 mb-8 border-2 border-[#333]">
          {[
            { label: "VALOR_TOTAL", value: "$89,830", sub: "LP POSITIONS", color: "#e5e5e5" },
            { label: "IMPERMANENT_LOSS", value: "-$1,582", sub: "-1.76% TOTAL", color: "#ef4444" },
            { label: "FEES_EARNED", value: "+$2,591", sub: "+2.88% APR", color: "#22c55e" },
            { label: "HODL_VALUE", value: "$91,412", sub: "DELTA: -$1,582", color: "#ff6b35" },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-6 ${i !== 3 ? "border-r-2 border-[#333]" : ""} bg-[#0d0d0d] hover:bg-[#1a1a1a] transition-colors group`}
            >
              <p className="text-xs text-[#666] tracking-[0.2em] mb-1">{`// ${stat.label}`}</p>
              <p className="text-3xl font-black tracking-tighter" style={{ color: stat.color }}>
                {stat.value}
              </p>
              <p className="text-xs text-[#444] mt-1">{stat.sub}</p>
              <div className="w-full h-1 bg-[#1a1a1a] mt-4 group-hover:bg-[#333] transition-colors">
                <div className="h-full bg-[#ff6b35]" style={{ width: "65%" }} />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Chart */}
          <div className="col-span-8 border-2 border-[#333] bg-[#0d0d0d]">
            <div className="p-4 border-b-2 border-[#333] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#ff6b35]" />
                <span className="text-sm font-bold uppercase tracking-wider">PRICE_CHART // ETH_IL_CORRELATION</span>
              </div>
              <div className="flex">
                {["1H", "1D", "1W", "1M"].map((t, i) => (
                  <button
                    key={t}
                    className={`px-4 py-2 text-xs font-bold tracking-wider border-l-2 border-[#333] first:border-l-0 ${
                      t === "1D" ? "bg-[#ff6b35] text-black" : "text-[#666] hover:text-[#e5e5e5]"
                    } transition-colors`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="p-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="brutalistGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff6b35" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ff6b35" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    stroke="#333" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: '#333', strokeWidth: 2 }}
                  />
                  <YAxis 
                    stroke="#333" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={{ stroke: '#333', strokeWidth: 2 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1a1a1a",
                      border: "2px solid #ff6b35",
                      borderRadius: "0",
                      fontFamily: "monospace",
                      fontSize: "12px",
                    }}
                  />
                  <ReferenceLine y={2150} stroke="#333" strokeDasharray="3 3" />
                  <Area 
                    type="stepAfter" 
                    dataKey="price" 
                    stroke="#ff6b35" 
                    fill="url(#brutalistGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Simulator */}
          <div className="col-span-4 border-2 border-[#333] bg-[#0d0d0d]">
            <div className="p-4 border-b-2 border-[#333]">
              <span className="text-sm font-bold uppercase tracking-wider text-[#ff6b35]">// RISK_SIMULATOR</span>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs text-[#666] uppercase tracking-wider">PRICE_DELTA</span>
                  <span className="text-xl font-black text-[#ff6b35]">{priceChange > 0 ? "+" : ""}{priceChange}%</span>
                </div>
                <input
                  type="range"
                  min="-50"
                  max="50"
                  value={priceChange}
                  onChange={(e) => setPriceChange(Number(e.target.value))}
                  className="w-full h-2 bg-[#1a1a1a] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:bg-[#ff6b35]"
                />
                <div className="flex justify-between text-xs text-[#333] mt-1 font-bold">
                  <span>-50%</span>
                  <span>0%</span>
                  <span>+50%</span>
                </div>
              </div>

              <div className="border-2 border-[#333] divide-y-2 divide-[#333]">
                <div className="p-4 flex justify-between items-center">
                  <span className="text-xs text-[#666] uppercase tracking-wider">EST_IL</span>
                  <span className="text-lg font-black text-[#ef4444]">-$2,340</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-xs text-[#666] uppercase tracking-wider">LOSS_%</span>
                  <span className="text-lg font-black text-[#ef4444]">-2.60%</span>
                </div>
                <div className="p-4 flex justify-between items-center">
                  <span className="text-xs text-[#666] uppercase tracking-wider">RISK_LEVEL</span>
                  <span className="px-3 py-1 bg-[#ff6b35] text-black text-xs font-black uppercase">MEDIUM</span>
                </div>
              </div>

              <button className="w-full py-4 bg-[#ff6b35] text-black font-black text-lg uppercase tracking-wider hover:bg-[#ff8555] transition-colors flex items-center justify-center gap-3 group">
                <Shield className="w-6 h-6" strokeWidth={3} />
                <span>ACTIVATE_HEDGE</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-xs text-[#444] text-center uppercase tracking-wider">// POWERED_BY_HYPERLIQUID</p>
            </div>
          </div>
        </div>

        {/* Positions Table */}
        <div className="mt-8 border-2 border-[#333]">
          <div className="p-4 border-b-2 border-[#333] flex items-center justify-between bg-[#1a1a1a]">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-[#ff6b35]" />
              <span className="text-sm font-bold uppercase tracking-wider">ACTIVE_POSITIONS</span>
              <span className="px-2 py-0.5 bg-[#333] text-xs font-bold">{positions.length}</span>
            </div>
            <button className="flex items-center gap-2 text-xs text-[#666] hover:text-[#ff6b35] transition-colors uppercase tracking-wider">
              <ExternalLink className="w-4 h-4" />
              VIEW_ON_UNISWAP
            </button>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#333] bg-[#0d0d0d]">
                <th className="text-left text-xs text-[#666] uppercase tracking-[0.15em] p-4 font-bold">PAIR</th>
                <th className="text-right text-xs text-[#666] uppercase tracking-[0.15em] p-4 font-bold">VALUE</th>
                <th className="text-right text-xs text-[#666] uppercase tracking-[0.15em] p-4 font-bold">IL</th>
                <th className="text-right text-xs text-[#666] uppercase tracking-[0.15em] p-4 font-bold">IL_%</th>
                <th className="text-right text-xs text-[#666] uppercase tracking-[0.15em] p-4 font-bold">FEES</th>
                <th className="text-right text-xs text-[#666] uppercase tracking-[0.15em] p-4 font-bold">STATUS</th>
                <th className="text-right text-xs text-[#666] uppercase tracking-[0.15em] p-4 font-bold">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((pos, i) => (
                <tr 
                  key={pos.id} 
                  className={`border-b-2 border-[#222] hover:bg-[#1a1a1a] transition-colors ${
                    pos.status === "UNPROTECTED" ? "bg-[#ff6b35]/5" : ""
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1a1a1a] border-2 border-[#333] flex items-center justify-center text-xs font-black">
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      <span className="font-bold">{pos.pair}</span>
                    </div>
                  </td>
                  <td className="text-right p-4 font-bold">{pos.value}</td>
                  <td className="text-right p-4 font-bold text-[#ef4444]">{pos.il}</td>
                  <td className="text-right p-4">
                    <span className="px-2 py-1 bg-[#ef4444]/20 text-[#ef4444] text-xs font-bold">
                      {pos.ilPercent}
                    </span>
                  </td>
                  <td className="text-right p-4 font-bold text-[#22c55e]">{pos.fees}</td>
                  <td className="text-right p-4">
                    <span className={`px-3 py-1 text-xs font-black uppercase tracking-wider ${
                      pos.status === "PROTECTED" 
                        ? "bg-[#22c55e] text-black" 
                        : "bg-[#ff6b35]/20 text-[#ff6b35] border border-[#ff6b35]"
                    }`}>
                      {pos.status}
                    </span>
                  </td>
                  <td className="text-right p-4">
                    <button className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-2 transition-colors ${
                      pos.status === "PROTECTED"
                        ? "border-[#333] text-[#666] hover:border-[#e5e5e5] hover:text-[#e5e5e5]"
                        : "border-[#ff6b35] text-[#ff6b35] hover:bg-[#ff6b35] hover:text-black"
                    }`}>
                      {pos.status === "PROTECTED" ? "MANAGE" : "PROTECT"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Palette Info */}
        <div className="mt-8 border-2 border-[#333] p-6">
          <h3 className="text-lg font-black mb-6 text-[#ff6b35] uppercase tracking-wider">// CONCEPTO_3: DARK_BRUTALIST</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-[#666] tracking-[0.2em] mb-4 uppercase">PALETA_DE_COLORES</p>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#0d0d0d] border-2 border-[#333]" />
                  <span className="text-xs mt-2 text-[#666]">#0d0d0d</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#1a1a1a] border-2 border-[#333]" />
                  <span className="text-xs mt-2 text-[#666]">#1a1a1a</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#ff6b35]" />
                  <span className="text-xs mt-2 text-[#666]">#ff6b35</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#ef4444]" />
                  <span className="text-xs mt-2 text-[#666]">#ef4444</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#22c55e]" />
                  <span className="text-xs mt-2 text-[#666]">#22c55e</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#666] tracking-[0.2em] mb-4 uppercase">MOOD_&_TIPOGRAFIA</p>
              <p className="text-sm text-[#888] leading-relaxed">
                <strong className="text-[#e5e5e5]">Mood:</strong> Herramienta poderosa, cruda, para traders serios<br />
                <strong className="text-[#e5e5e5]">Font:</strong> Geist Mono (todo) - estilo terminal/código<br />
                <strong className="text-[#e5e5e5]">Estilo:</strong> Bordes duros, sin redondeos, warnings destacados, geometría fuerte
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
