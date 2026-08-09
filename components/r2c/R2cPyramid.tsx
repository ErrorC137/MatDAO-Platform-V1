"use client"

import { useState } from "react"
import { Award, ChevronRight, Flame, HelpCircle, Users } from "lucide-react"
import { ProjectLogo } from "./ProjectLogo"
import type { TrlProject } from "@/lib/trl-services/types"

interface Tier {
  id: number
  name: string
  trlRange: string
  levels: number[]
  pillColor: string
  textColor: string
  description: string
  points: string
  topLabelOffset: number
  colorClass: string
  borderColor: string
}

const tiers: Tier[] = [
  {
    id: 4,
    name: "Market Deployment & Operations",
    trlRange: "TRL 8-9",
    levels: [8, 9],
    colorClass: "fill-emerald-500/15 hover:fill-emerald-500/25",
    borderColor: "stroke-emerald-400",
    pillColor: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30",
    textColor: "text-emerald-300",
    description: "Flight-qualified, industry certified, or in active commercial deployment.",
    points: "155,50 345,50 375,110 125,110",
    topLabelOffset: 80,
  },
  {
    id: 3,
    name: "Pilot & System Demonstration",
    trlRange: "TRL 6-7",
    levels: [6, 7],
    colorClass: "fill-teal-500/15 hover:fill-teal-500/25",
    borderColor: "stroke-teal-400",
    pillColor: "bg-teal-500/10 text-teal-400 border border-teal-500/35",
    textColor: "text-teal-300",
    description: "Prototypes tested in operational pipelines or relevant environment simulations.",
    points: "125,112 375,112 410,185 90,185",
    topLabelOffset: 148,
  },
  {
    id: 2,
    name: "Technology Validation & Bench Prototype",
    trlRange: "TRL 4-5",
    levels: [4, 5],
    colorClass: "fill-amber-500/10 hover:fill-amber-500/20",
    borderColor: "stroke-amber-500/80",
    pillColor: "bg-amber-500/10 text-amber-400 border border-amber-500/30",
    textColor: "text-amber-300",
    description: "Sub-scale test arrays or laboratory components integrated into mock environments.",
    points: "90,187 410,187 450,270 50,270",
    topLabelOffset: 228,
  },
  {
    id: 1,
    name: "Applied Research & Lab Proof",
    trlRange: "TRL 1-3",
    levels: [1, 2, 3],
    colorClass: "fill-indigo-500/10 hover:fill-indigo-500/20",
    borderColor: "stroke-indigo-500/60",
    pillColor: "bg-indigo-500/15 text-indigo-400 border border-indigo-500/20",
    textColor: "text-indigo-300",
    description: "Theoretical papers, mathematical formulations, or molecular screening in lab settings.",
    points: "50,272 450,272 490,360 10,360",
    topLabelOffset: 315,
  },
]

interface R2cPyramidProps {
  projects: TrlProject[]
  onSelectProject?: (project: TrlProject) => void
}

export function R2cPyramid({ projects, onSelectProject }: R2cPyramidProps) {
  const [selectedTier, setSelectedTier] = useState<number | null>(null)
  const [hoveredTier, setHoveredTier] = useState<number | null>(null)

  const getProjectsInTier = (levels: number[]) => projects.filter((p) => levels.includes(p.trl))

  const activeTier = selectedTier !== null ? tiers.find((t) => t.id === selectedTier) : null
  const filteredProjects = activeTier ? getProjectsInTier(activeTier.levels) : projects

  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
      <div className="workflow-panel relative overflow-hidden rounded-2xl p-6 lg:col-span-6">
        <div className="mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-[#6efcff]" />
          <h2 className="font-headline text-lg font-bold uppercase tracking-tight text-white/95">
            Commercialization Pyramid
          </h2>
        </div>
        <p className="mb-4 text-xs text-white/55">
          Click a tier to filter deep-tech projects by Technology Readiness Level.
        </p>

        <div className="relative flex justify-center py-4">
          <svg viewBox="0 0 500 400" className="h-auto w-full max-w-[420px] drop-shadow-lg">
            <line x1="250" y1="10" x2="250" y2="380" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <polygon points="250,20 495,365 5,365" fill="url(#pyrGlow)" />
            <defs>
              <linearGradient id="pyrGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            {tiers.map((tier) => {
              const count = getProjectsInTier(tier.levels).length
              const isSelected = selectedTier === tier.id
              const isHovered = hoveredTier === tier.id
              return (
                <g
                  key={tier.id}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => setSelectedTier(selectedTier === tier.id ? null : tier.id)}
                  onMouseEnter={() => setHoveredTier(tier.id)}
                  onMouseLeave={() => setHoveredTier(null)}
                >
                  <polygon
                    points={tier.points}
                    className={`stroke-2 transition-colors duration-200 ${tier.colorClass} ${
                      isSelected ? "fill-emerald-500/35 stroke-emerald-300" : isHovered ? "stroke-slate-100" : tier.borderColor
                    }`}
                  />
                  <text
                    x="250"
                    y={tier.topLabelOffset + 2}
                    textAnchor="middle"
                    className={`text-[10px] font-mono font-bold tracking-wider ${isSelected ? "fill-slate-950" : "fill-slate-300"}`}
                  >
                    {tier.trlRange}
                  </text>
                  <text x="410" y={tier.topLabelOffset + 2} textAnchor="middle" className="text-[9px] font-mono fill-slate-300">
                    {count}
                  </text>
                </g>
              )
            })}
            <text x="250" y="32" textAnchor="middle" className="text-[9px] font-mono font-bold uppercase tracking-widest fill-emerald-400/80">
              R2C Peak
            </text>
          </svg>
        </div>

        {activeTier && (
          <div className="mt-4 rounded-xl border border-white/10 bg-black/30 p-4">
            <span className={`rounded px-2 py-0.5 text-xs font-mono font-bold ${activeTier.pillColor}`}>
              {activeTier.trlRange}
            </span>
            <h4 className="mt-2 text-sm font-bold text-white/90">{activeTier.name}</h4>
            <p className="mt-1 text-xs text-white/55">{activeTier.description}</p>
          </div>
        )}
      </div>

      <div className="space-y-6 lg:col-span-6">
        <div className="workflow-panel rounded-2xl p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-[#6efcff]" />
              <h3 className="font-headline text-base font-bold text-white/95">R2C Standings</h3>
            </div>
            <span className="rounded-lg border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-sm font-bold text-[#6efcff]">
              {filteredProjects.length}
            </span>
          </div>

          <div className="max-h-[500px] space-y-3 overflow-y-auto pr-1">
            {filteredProjects.length === 0 ? (
              <div className="rounded-xl border border-dashed border-white/15 py-12 text-center">
                <HelpCircle className="mx-auto mb-2 h-8 w-8 text-white/30" />
                <span className="text-xs text-white/50">No projects in this tier.</span>
              </div>
            ) : (
              [...filteredProjects]
                .sort((a, b) => b.score - a.score)
                .map((project, index) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => onSelectProject?.(project)}
                    className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border border-white/10 bg-black/20 p-4 text-left transition-all hover:border-[#6efcff]/30 hover:bg-black/40"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/40 font-mono text-xs font-bold text-white/60">
                        #{index + 1}
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/40">
                        <ProjectLogo logo={project.logo} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="truncate text-xs font-semibold text-white/90 group-hover:text-[#c5fdff]">
                          {project.title}
                        </h4>
                        <p className="text-[10px] text-white/45">{project.category}</p>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <div className="text-right">
                        <span className="block rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#6efcff]">
                          TRL {project.trl}
                        </span>
                        <span className="mt-0.5 block font-mono text-[10px] text-white/45">
                          Score: <strong className="text-emerald-400">{project.score}</strong>
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-white/30 group-hover:text-white/60" />
                    </div>
                  </button>
                ))
            )}
          </div>
        </div>

        <div className="flex items-start gap-4 rounded-2xl border border-emerald-900/30 bg-gradient-to-br from-emerald-950/20 to-teal-950/20 p-5">
          <Flame className="h-5 w-5 shrink-0 text-emerald-400" />
          <p className="text-xs leading-relaxed text-white/65">
            Projects at <strong className="text-white/80">TRL 6–8</strong> represent high-impact, de-risked transfer targets.
            MatDAO aggregates validation trails so corporations can license vetted technology from the pyramid pipeline.
          </p>
        </div>
      </div>
    </div>
  )
}
