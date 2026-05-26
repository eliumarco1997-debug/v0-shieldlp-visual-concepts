"use client"

import { useState } from "react"
import { Shield, Wallet, TrendingUp, TrendingDown, Activity, Zap, ChevronDown, ExternalLink } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

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
  { id: 1, pair: "ETH/USDC", value: "$45,230", il: "-$892", fees: "+$1,245", apr: "24.5%", status: "active" },
  { id: 2, pair: "WBTC/ETH", value: "$32,100", il: "-$456", fees: "+$890", apr: "18.2%", status: "hedged" },
  { id: 3, pair: "ARB/ETH", value: "$12,500", il: "-$234", fees: "+$456", apr: "32.1%", status: "active" },
]

export function CyberShieldDashboard() {
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#030712] text-white overflow-hidden relative">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-fuchsia-500/20 rounded-full blur-[120px] animate-pulse" />

      <div className="relative z-10 p-6 pt-20">
        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Shield className="w-10 h-10 text-cyan-400" />
              <div className="absolute inset-0 blur-lg bg-cyan-400/50" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">
                ShieldLP
              </h1>
              <p className="text-xs text-cyan-400/60">Protege tu liquidez. Hedgea tus pools.</p>
            </div>
          </div>
          
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30 backdrop-blur-xl hover:border-cyan-400/50 transition-all group">
            <Wallet className="w-4 h-4 text-cyan-400" />
            <span className="text-sm">0x7a3d...8f2e</span>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Valor Total", value: "$89,830", change: "+12.4%", icon: TrendingUp, color: "cyan" },
            { label: "Impermanent Loss", value: "-$1,582", change: "-2.1%", icon: TrendingDown, color: "fuchsia" },
            { label: "Fees Ganados", value: "+$2,591", change: "+8.7%", icon: Activity, color: "emerald" },
            { label: "Si Solo HODL", value: "$91,412", change: "vs LP", icon: Zap, color: "amber" },
          ].map((stat, i) => (
            <div
              key={i}
              className="relative group p-5 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl overflow-hidden hover:border-cyan-500/30 transition-all"
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
              <div className="relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                </div>
                <p className="text-2xl font-bold mb-1">{stat.value}</p>
                <span className={`text-xs ${stat.change.startsWith('+') ? 'text-emerald-400' : stat.change.startsWith('-') ? 'text-rose-400' : 'text-slate-400'}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Chart Section */}
          <div className="col-span-2 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Precio ETH + Impermanent Loss</h2>
              <div className="flex gap-2">
                {["1D", "1W", "1M", "ALL"].map((t) => (
                  <button
                    key={t}
                    className="px-3 py-1 text-xs rounded-lg bg-slate-800/50 text-slate-400 hover:bg-cyan-500/20 hover:text-cyan-400 transition-all"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceData}>
                  <defs>
                    <linearGradient id="cyberGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ilGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d946ef" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#d946ef" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="time" stroke="#475569" fontSize={10} />
                  <YAxis stroke="#475569" fontSize={10} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      border: "1px solid #334155",
                      borderRadius: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="price" stroke="#06b6d4" fill="url(#cyberGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Risk Calculator */}
          <div className="rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl p-6">
            <h2 className="text-lg font-semibold mb-6">Simulador de Riesgo</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 uppercase tracking-wider">Variación de Precio</label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    defaultValue="0"
                    className="flex-1 h-2 bg-slate-700 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                  />
                  <span className="text-cyan-400 font-mono">+25%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-400 text-sm">IL Estimado</span>
                  <span className="text-fuchsia-400 font-semibold">-$2,340</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 text-sm">% de Pérdida</span>
                  <span className="text-rose-400 font-semibold">-2.6%</span>
                </div>
              </div>

              <button className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 font-semibold text-black hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center justify-center gap-2">
                  <Shield className="w-5 h-5" />
                  Activar Cobertura
                </span>
              </button>
              <p className="text-xs text-center text-slate-500">Powered by Hyperliquid</p>
            </div>
          </div>
        </div>

        {/* Positions Table */}
        <div className="mt-6 rounded-2xl bg-gradient-to-br from-slate-900/80 to-slate-800/40 border border-slate-700/50 backdrop-blur-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Posiciones LP</h2>
            <button className="flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
              <ExternalLink className="w-4 h-4" />
              Ver en Uniswap
            </button>
          </div>
          
          <div className="overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left text-xs text-slate-400 uppercase tracking-wider pb-4">Par</th>
                  <th className="text-right text-xs text-slate-400 uppercase tracking-wider pb-4">Valor</th>
                  <th className="text-right text-xs text-slate-400 uppercase tracking-wider pb-4">IL</th>
                  <th className="text-right text-xs text-slate-400 uppercase tracking-wider pb-4">Fees</th>
                  <th className="text-right text-xs text-slate-400 uppercase tracking-wider pb-4">APR</th>
                  <th className="text-right text-xs text-slate-400 uppercase tracking-wider pb-4">Estado</th>
                  <th className="text-right text-xs text-slate-400 uppercase tracking-wider pb-4">Acción</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos) => (
                  <tr
                    key={pos.id}
                    onClick={() => setSelectedPosition(pos.id)}
                    className={`border-b border-slate-700/30 cursor-pointer transition-all hover:bg-cyan-500/5 ${
                      selectedPosition === pos.id ? "bg-cyan-500/10" : ""
                    }`}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold">
                          {pos.pair.split("/")[0][0]}
                        </div>
                        <span className="font-medium">{pos.pair}</span>
                      </div>
                    </td>
                    <td className="text-right font-mono">{pos.value}</td>
                    <td className="text-right font-mono text-rose-400">{pos.il}</td>
                    <td className="text-right font-mono text-emerald-400">{pos.fees}</td>
                    <td className="text-right font-mono text-cyan-400">{pos.apr}</td>
                    <td className="text-right">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          pos.status === "hedged"
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-slate-700/50 text-slate-400"
                        }`}
                      >
                        {pos.status === "hedged" ? "🛡️ Protegido" : "Sin cobertura"}
                      </span>
                    </td>
                    <td className="text-right">
                      <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30 text-cyan-400 text-sm hover:border-cyan-400/50 transition-all">
                        {pos.status === "hedged" ? "Gestionar" : "Proteger"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Palette Info */}
        <div className="mt-8 p-6 rounded-2xl bg-slate-900/50 border border-slate-700/50">
          <h3 className="text-lg font-semibold mb-4 text-cyan-400">🎨 Concepto 1: Cyber Shield</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-slate-400 mb-3">Paleta de Colores:</p>
              <div className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#030712] border border-slate-600" />
                  <span className="text-xs mt-1 text-slate-500">#030712</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-cyan-400" />
                  <span className="text-xs mt-1 text-slate-500">#22d3ee</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-fuchsia-500" />
                  <span className="text-xs mt-1 text-slate-500">#d946ef</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-slate-800" />
                  <span className="text-xs mt-1 text-slate-500">#1e293b</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-400" />
                  <span className="text-xs mt-1 text-slate-500">#34d399</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-3">Mood & Tipografía:</p>
              <p className="text-sm text-slate-300">
                <strong>Mood:</strong> Alta tecnología, protección futurista, cyberpunk elegante<br />
                <strong>Font:</strong> Geist Sans (headings) + Geist Mono (datos)<br />
                <strong>Efectos:</strong> Glassmorphism, glows neon, grid animado
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
