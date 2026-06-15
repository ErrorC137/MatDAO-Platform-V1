"use client"

import { useEffect, useState } from "react"
import { Award, X } from "lucide-react"
import { R2cPyramid } from "@/components/r2c/R2cPyramid"
import { ProjectLogo } from "@/components/r2c/ProjectLogo"
import { TrlBackendStatus } from "@/components/trl-services/TrlBackendStatus"
import { fetchProjects } from "@/lib/trl-services/api"
import type { TrlProject } from "@/lib/trl-services/types"

export default function R2cLeaderboardPage() {
  const [projects, setProjects] = useState<TrlProject[]>([])
  const [selected, setSelected] = useState<TrlProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] px-5 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Award className="h-3.5 w-3.5" />
            R2C Commercialization Leaderboard
          </p>
          <h1 className="font-headline mb-2 text-3xl font-extrabold text-white/95 md:text-4xl">
            Research-to-Commercialization Pyramid
          </h1>
          <p className="max-w-2xl text-sm text-white/60">
            Explore deep-tech projects ranked by TRL stage and innovation score. Filter by commercialization tier
            on the interactive pyramid.
          </p>
          <div className="mt-4">
            <TrlBackendStatus />
          </div>
        </div>

        {loading ? (
          <div className="py-20 text-center text-white/50">Loading leaderboard...</div>
        ) : (
          <R2cPyramid projects={projects} onSelectProject={setSelected} />
        )}

        {selected && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="workflow-panel max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-black/40">
                    <ProjectLogo logo={selected.logo} className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="font-headline text-lg font-bold text-white/95">{selected.title}</h2>
                    <p className="text-xs text-white/50">{selected.author}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-lg p-2 text-white/50 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mb-4 flex gap-2">
                <span className="rounded-full border border-[#6efcff]/30 bg-[#6efcff]/10 px-3 py-1 font-mono text-xs text-[#c5fdff]">
                  TRL {selected.trl}
                </span>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
                  Score {selected.score}
                </span>
              </div>
              <p className="mb-4 text-sm text-white/70">{selected.trlSummary}</p>
              <h3 className="mb-2 text-sm font-semibold text-white/85">Milestone Roadmap</h3>
              <div className="space-y-2">
                {Object.entries(selected.milestones).map(([key, m]) => (
                  <div key={key} className="rounded-lg border border-white/10 bg-black/20 p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-white/70">{key}</span>
                      <span className="font-mono text-[10px] text-[#6efcff]">{m.status}</span>
                    </div>
                    <p className="mt-1 text-xs text-white/55">{m.description}</p>
                    <p className="mt-1 font-mono text-[10px] text-white/40">{m.timeline}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
