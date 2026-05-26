"use client"

import { useState } from "react"
import { CyberShieldDashboard } from "@/components/concepts/cyber-shield"
import { InstitutionalDashboard } from "@/components/concepts/institutional"
import { BrutalistDashboard } from "@/components/concepts/brutalist"

type Concept = "cyber" | "institutional" | "brutalist"

export default function Home() {
  const [activeConcept, setActiveConcept] = useState<Concept>("cyber")

  return (
    <div className="min-h-screen">
      {/* Concept Switcher */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex gap-2 p-1.5 rounded-full bg-black/80 backdrop-blur-xl border border-white/10">
        <button
          onClick={() => setActiveConcept("cyber")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeConcept === "cyber"
              ? "bg-cyan-500 text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          Cyber Shield
        </button>
        <button
          onClick={() => setActiveConcept("institutional")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeConcept === "institutional"
              ? "bg-emerald-500 text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          Institutional
        </button>
        <button
          onClick={() => setActiveConcept("brutalist")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeConcept === "brutalist"
              ? "bg-orange-500 text-black"
              : "text-white/70 hover:text-white"
          }`}
        >
          Brutalist
        </button>
      </div>

      {/* Render Active Concept */}
      {activeConcept === "cyber" && <CyberShieldDashboard />}
      {activeConcept === "institutional" && <InstitutionalDashboard />}
      {activeConcept === "brutalist" && <BrutalistDashboard />}
    </div>
  )
}
