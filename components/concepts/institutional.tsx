"use client"

import { useState } from "react"
import { Shield, Wallet, ChevronDown, ArrowUpRight, ArrowDownRight, BarChart3, PieChart, LineChart, Loader2 } from "lucide-react"
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar } from "recharts"
import { useCryptoData } from "@/hooks/useCryptoData"

export function InstitutionalDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("1M")
  const data = useCryptoData()

  // Helper: parse sign from change string to determine arrow direction
  const isPositiveChange = (change: string): boolean => {
    const trimmed = change.trim()
    if (trimmed.startsWith("+")) return true
    if (trimmed.startsWith("-")) return false
    // If no sign, check for Δ prefix (hodlValue delta)
    if (trimmed.includes("-")) return false
    return true
  }

  // Build metrics from live stats
  const metrics = [
    { label: "VALOR TOTAL EN LP", value: data.stats.totalValue, change: data.stats.totalChange, positive: isPositiveChange(data.stats.totalChange) },
    { label: "IMPERMANENT LOSS", value: data.stats.impermanentLoss, change: data.stats.ilChange, positive: false },
    { label: "FEES ACUMULADOS", value: data.stats.feesEarned, change: data.stats.feesChange, positive: isPositiveChange(data.stats.feesChange) },
    { label: "VALOR SI HODL", value: data.stats.hodlValue, change: `Δ ${data.stats.impermanentLoss}`, positive: false },
  ]

  if (data.loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#10b981] animate-spin" />
          <p className="text-sm text-[#666] tracking-wide">Cargando datos del mercado...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#fafafa]">
      <div className="max-w-[1600px] mx-auto p-8 pt-24">
        {/* Header */}
        <header className="flex items-center justify-between mb-12 pb-8 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-none bg-[#10b981] flex items-center justify-center">
              <Shield className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tight">ShieldLP</h1>
              <p className="text-sm text-[#666] tracking-wide">Protege tu liquidez. Hedgea tus pools.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Live indicator */}
            <div className="flex items-center gap-3 px-4 py-2 border border-[#1a1a1a] bg-[#111]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span className="text-xs text-[#666] tracking-wider">ETH</span>
              <span className="text-sm font-mono text-[#fafafa]">
                ${data.prices.eth.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {data.lastUpdated && (
                <span className="text-xs text-[#444] font-mono">
                  {data.lastUpdated.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
                </span>
              )}
            </div>

            <nav className="flex gap-8 text-sm text-[#666]">
              <a href="#" className="text-[#fafafa] border-b border-[#10b981] pb-1">Dashboard</a>
              <a href="#" className="hover:text-[#fafafa] transition-colors">Posiciones</a>
              <a href="#" className="hover:text-[#fafafa] transition-colors">Analytics</a>
              <a href="#" className="hover:text-[#fafafa] transition-colors">Historial</a>
            </nav>
            <div className="h-6 w-px bg-[#1a1a1a]" />
            <button className="flex items-center gap-3 px-5 py-2.5 bg-[#111] border border-[#222] text-sm hover:border-[#333] transition-colors">
              <div className="w-2 h-2 rounded-full bg-[#10b981]" />
              <span className="font-mono text-[#888]">0x7a3d...8f2e</span>
              <ChevronDown className="w-4 h-4 text-[#666]" />
            </button>
          </div>
        </header>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-px bg-[#1a1a1a] mb-12">
          {metrics.map((stat, i) => (
            <div key={i} className="bg-[#0a0a0a] p-8">
              <p className="text-xs text-[#666] tracking-[0.2em] mb-4">{stat.label}</p>
              <p className="text-3xl font-light tracking-tight mb-2 font-mono">{stat.value}</p>
              <div className="flex items-center gap-2">
                {stat.positive ? (
                  <ArrowUpRight className="w-4 h-4 text-[#10b981]" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-[#ef4444]" />
                )}
                <span className={`text-sm ${stat.positive ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                  {stat.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Main Chart */}
          <div className="col-span-8 bg-[#0a0a0a] border border-[#1a1a1a] p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-light mb-1">Performance Overview</h2>
                <p className="text-sm text-[#666]">Precio del activo vs Impermanent Loss</p>
              </div>
              <div className="flex border border-[#1a1a1a]">
                {["1D", "1W", "1M", "1Y", "ALL"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTimeframe(t)}
                    className={`px-4 py-2 text-xs tracking-wider transition-colors ${
                      selectedTimeframe === t
                        ? "bg-[#10b981] text-black"
                        : "text-[#666] hover:text-[#fafafa]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData}>
                  <defs>
                    <linearGradient id="institutionalGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis 
                    dataKey="time" 
                    stroke="#333" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={{ stroke: '#1a1a1a' }}
                  />
                  <YAxis 
                    stroke="#333" 
                    fontSize={11} 
                    tickLine={false}
                    axisLine={{ stroke: '#1a1a1a' }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#111",
                      border: "1px solid #222",
                      borderRadius: "0",
                      fontSize: "12px",
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10b981" 
                    fill="url(#institutionalGradient)" 
                    strokeWidth={1.5} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Panel - Calculator */}
          <div className="col-span-4 space-y-8">
            {/* Risk Calculator */}
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-8">
              <h2 className="text-xs text-[#666] tracking-[0.2em] mb-6">CALCULADORA DE RIESGO</h2>
              
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-[#888]">Cambio de precio simulado</span>
                    <span className="text-sm font-mono text-[#10b981]">+25%</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    defaultValue="25"
                    className="w-full h-px bg-[#333] appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#10b981]"
                  />
                  <div className="flex justify-between text-xs text-[#444] mt-1">
                    <span>-50%</span>
                    <span>+50%</span>
                  </div>
                </div>

                <div className="border-t border-[#1a1a1a] pt-6">
                  <div className="flex justify-between mb-4">
                    <span className="text-[#666] text-sm">IL Estimado</span>
                    <span className="font-mono">-$2,340.00</span>
                  </div>
                  <div className="flex justify-between mb-4">
                    <span className="text-[#666] text-sm">% de Portfolio</span>
                    <span className="font-mono text-[#ef4444]">-2.60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#666] text-sm">Break-even Fees</span>
                    <span className="font-mono text-[#10b981]">14 días</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hedge CTA */}
            <div className="bg-[#10b981] p-8 text-black">
              <h3 className="text-xs tracking-[0.2em] mb-4 text-black/60">PROTECCIÓN DISPONIBLE</h3>
              <p className="text-2xl font-light mb-6">Activa cobertura para tus posiciones LP</p>
              <button className="w-full py-4 bg-black text-[#fafafa] text-sm tracking-wider hover:bg-black/90 transition-colors flex items-center justify-center gap-2">
                <Shield className="w-4 h-4" />
                ACTIVAR COBERTURA
              </button>
              <p className="text-xs text-black/50 mt-4 text-center">Powered by Hyperliquid</p>
            </div>
          </div>
        </div>

        {/* Positions Table */}
        <div className="mt-12 bg-[#0a0a0a] border border-[#1a1a1a]">
          <div className="p-8 border-b border-[#1a1a1a]">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-light">Posiciones Activas</h2>
              <button className="text-sm text-[#666] hover:text-[#fafafa] transition-colors flex items-center gap-2">
                Ver en Uniswap
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left text-xs text-[#666] tracking-[0.15em] p-6 font-normal">PAR</th>
                <th className="text-right text-xs text-[#666] tracking-[0.15em] p-6 font-normal">VALOR ACTUAL</th>
                <th className="text-right text-xs text-[#666] tracking-[0.15em] p-6 font-normal">IMPERMANENT LOSS</th>
                <th className="text-right text-xs text-[#666] tracking-[0.15em] p-6 font-normal">FEES GANADOS</th>
                <th className="text-right text-xs text-[#666] tracking-[0.15em] p-6 font-normal">VALOR SI HODL</th>
                <th className="text-right text-xs text-[#666] tracking-[0.15em] p-6 font-normal">ESTADO</th>
                <th className="text-right text-xs text-[#666] tracking-[0.15em] p-6 font-normal">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {data.positions.map((pos) => (
                <tr key={pos.id} className="border-b border-[#1a1a1a] hover:bg-[#111] transition-colors">
                  <td className="p-6">
                    <span className="font-mono">{pos.pair}</span>
                  </td>
                  <td className="text-right p-6 font-mono">{pos.value}</td>
                  <td className="text-right p-6 font-mono text-[#ef4444]">{pos.il}</td>
                  <td className="text-right p-6 font-mono text-[#10b981]">{pos.fees}</td>
                  <td className="text-right p-6 font-mono text-[#888]">{pos.holdValue}</td>
                  <td className="text-right p-6">
                    <span className={`px-3 py-1 text-xs tracking-wider ${
                      pos.status === "hedged" 
                        ? "bg-[#10b981] text-black" 
                        : "border border-[#333] text-[#666]"
                    }`}>
                      {pos.status === "hedged" ? "PROTEGIDO" : "SIN COBERTURA"}
                    </span>
                  </td>
                  <td className="text-right p-6">
                    <button className="px-4 py-2 text-xs tracking-wider border border-[#333] text-[#888] hover:border-[#10b981] hover:text-[#10b981] transition-colors">
                      {pos.status === "hedged" ? "GESTIONAR" : "PROTEGER"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Palette Info */}
        <div className="mt-12 p-8 border border-[#1a1a1a]">
          <h3 className="text-lg font-light mb-6 text-[#10b981]">🎨 Concepto 2: Minimal Institutional</h3>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs text-[#666] tracking-[0.15em] mb-4">PALETA DE COLORES</p>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#0a0a0a] border border-[#333]" />
                  <span className="text-xs mt-2 text-[#666] font-mono">#0a0a0a</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#1a1a1a]" />
                  <span className="text-xs mt-2 text-[#666] font-mono">#1a1a1a</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#10b981]" />
                  <span className="text-xs mt-2 text-[#666] font-mono">#10b981</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#fafafa]" />
                  <span className="text-xs mt-2 text-[#666] font-mono">#fafafa</span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-[#ef4444]" />
                  <span className="text-xs mt-2 text-[#666] font-mono">#ef4444</span>
                </div>
              </div>
            </div>
            <div>
              <p className="text-xs text-[#666] tracking-[0.15em] mb-4">MOOD & TIPOGRAFÍA</p>
              <p className="text-sm text-[#888] leading-relaxed">
                <strong className="text-[#fafafa]">Mood:</strong> Banca institucional, hedge fund, confianza y seriedad<br />
                <strong className="text-[#fafafa]">Font:</strong> Geist Sans Light (headings) + Geist Mono (datos financieros)<br />
                <strong className="text-[#fafafa]">Estilo:</strong> Mucho espacio negativo, líneas limpias, sin bordes redondeados
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
