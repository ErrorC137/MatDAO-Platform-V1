"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Target } from "lucide-react"
import { MILESTONE_LABELS } from "@/lib/trl-services/storage"
import type { TrlReport } from "@/lib/ai-studio/trl"

export default function TrlResultsPage() {
  const [report, setReport] = useState<TrlReport | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("matdao-trl-report")
    if (stored) setReport(JSON.parse(stored))
  }, [])

  if (!report) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-4 text-white/60">No TRL report found.</p>
          <Link href="/ai-studio/trl/submit" className="text-sm text-[#6efcff] hover:underline">
            Run an evaluation first
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative px-5 py-12 sm:px-6">
      <div className="relative z-10 mx-auto max-w-3xl">
        <p className="mb-2 text-[11px] uppercase tracking-wider text-[#c5fdff]">TRL Evaluation Results</p>
        <h1 className="font-headline mb-1 text-2xl font-bold text-white/95 md:text-3xl">{report.documentName}</h1>
        <p className="mb-6 text-sm text-white/50">{report.sectorName}</p>

        <div className="mb-8 grid grid-cols-2 gap-4">
          <div className="workflow-panel rounded-xl p-5 text-center">
            <Target className="mx-auto mb-2 h-6 w-6 text-[#6efcff]" />
            <p className="text-[10px] uppercase tracking-wider text-white/45">TRL Level</p>
            <p className="font-headline text-3xl font-bold text-white/95">TRL {report.trl}</p>
          </div>
          <div className="workflow-panel rounded-xl p-5 text-center">
            <p className="text-[10px] uppercase tracking-wider text-white/45">Innovation Score</p>
            <p className="font-headline text-3xl font-bold text-emerald-400">{report.innovationScore}</p>
          </div>
        </div>

        <section className="workflow-panel mb-6 rounded-2xl p-6">
          <h2 className="mb-3 font-headline text-lg font-bold text-white/95">Summary</h2>
          <p className="text-sm text-white/70">{report.trlSummary}</p>
          <ul className="mt-4 space-y-1">
            {report.accomplishments.map((a) => (
              <li key={a} className="text-xs text-white/55">
                · {a}
              </li>
            ))}
          </ul>
        </section>

        <section className="workflow-panel mb-6 rounded-2xl p-6">
          <h2 className="mb-4 font-headline text-lg font-bold text-white/95">Milestone Roadmap</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(report.milestones).map(([key, m]) => (
              <div key={key} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white/70">{MILESTONE_LABELS[key] || key}</span>
                  <span className="font-mono text-[10px] capitalize text-[#6efcff]">{m.status}</span>
                </div>
                <p className="mt-2 text-xs text-white/60">{m.description}</p>
                <p className="mt-1 font-mono text-[10px] text-white/40">{m.timeline}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="workflow-panel rounded-2xl p-6">
          <h2 className="mb-2 font-headline text-lg font-bold text-white/95">Partnership Outlook</h2>
          <p className="text-sm text-white/65">{report.potentialPartnership}</p>
          <p className="mt-4 text-xs text-white/40">
            Source: {report.analysisSource === "engine" ? "matdao-ip-engine" : "client fallback"} ·{" "}
            <Link href="/ai-studio/project-assessment" className="text-[#c5fdff] underline">
              Run full assessment (TRL + IP + DD)
            </Link>
          </p>
        </section>
      </div>
    </div>
  )
}
