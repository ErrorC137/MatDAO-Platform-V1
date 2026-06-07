"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertTriangle, CheckCircle2, FileText, XCircle } from "lucide-react"
import type { DueDiligenceReport } from "@/lib/ai-studio/types"
import { getInvestmentTierLabel } from "@/lib/ai-studio/due-diligence"

const TIER_STYLES = {
  pass: { bg: "bg-emerald-500/10 border-emerald-500/30", text: "text-emerald-300", icon: CheckCircle2 },
  review: { bg: "bg-amber-500/10 border-amber-500/30", text: "text-amber-300", icon: AlertTriangle },
  fail: { bg: "bg-red-500/10 border-red-500/30", text: "text-red-300", icon: XCircle },
}

const LAYER_LABELS = {
  extraction: "Layer 1 — Extraction",
  enrichment: "Layer 2 — Enrichment",
  integrity: "Integrity Gate",
}

export default function DueDiligenceResultsPage() {
  const [report, setReport] = useState<DueDiligenceReport | null>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem("matdao-dd-report")
    if (stored) setReport(JSON.parse(stored))
  }, [])

  if (!report) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="text-center">
          <p className="mb-4 text-white/60">No due diligence report found.</p>
          <Link href="/ai-studio/due-diligence/submit" className="text-sm text-[#6efcff] hover:underline">
            Run an evaluation first
          </Link>
        </div>
      </div>
    )
  }

  const tierStyle = TIER_STYLES[report.investmentTier]
  const TierIcon = tierStyle.icon
  const scorePct = Math.round((report.totalScore / report.maxTotalScore) * 100)

  return (
    <div className="relative px-5 py-12 sm:px-6 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute bottom-[-10%] left-[10%] h-[500px] w-[500px] rounded-full bg-amber-500/3 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl space-y-8">
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">Analysis Complete</p>
          <h1 className="font-headline text-3xl font-bold text-white/95 md:text-4xl">Due Diligence Report</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-white/55">
            <FileText className="h-4 w-4" />
            {report.documentName} · {report.wordCount} words
          </p>
        </div>

        {report.integrityGateTriggered && (
          <div className="risk-flag-pulse flex gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-4">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-200">Integrity Gate Triggered (Dim9)</p>
              <p className="mt-1 text-xs text-red-200/70">
                Research integrity concerns detected. Total score forced to 0 per MatDAO diligence policy.
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className={`rounded-xl border p-6 ${tierStyle.bg}`}>
            <div className="mb-3 flex items-center gap-2">
              <TierIcon className={`h-5 w-5 ${tierStyle.text}`} />
              <p className={`text-sm font-semibold ${tierStyle.text}`}>
                {getInvestmentTierLabel(report.investmentTier)}
              </p>
            </div>
            <p className="font-headline text-5xl font-bold text-white/95">
              {report.integrityGateTriggered ? "0" : report.totalScore}
              <span className="text-2xl text-white/40"> / {report.maxTotalScore}</span>
            </p>
            <p className="mt-2 text-xs text-white/50">{scorePct}% weighted investment confidence</p>
          </div>

          <div className="workflow-panel rounded-xl p-6">
            <p className="mb-3 text-[11px] uppercase tracking-wider text-white/45">Processing Layers</p>
            <div className="space-y-3 text-sm">
              <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-[#b8fcff]">Layer 1</p>
                <p className="text-white/70">{report.layers.layer1}</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/3 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-[#b8fcff]">Layer 2</p>
                <p className="text-white/70">{report.layers.layer2}</p>
              </div>
              <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-amber-300">Integrity Gate</p>
                <p className="text-white/70">{report.layers.integrityGate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="workflow-panel rounded-2xl p-6">
          <h2 className="font-headline mb-4 text-lg font-semibold">9-Dimension Scorecard</h2>
          <div className="space-y-3">
            {report.dimensions.map((dim) => {
              const pct = (dim.score / dim.maxScore) * 100
              const isIntegrity = dim.id === 9
              return (
                <div
                  key={dim.id}
                  className={`rounded-xl border p-4 ${
                    isIntegrity && dim.score <= 1
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-white/10 bg-white/2"
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-white/30">Dim{dim.id}</span>
                        <p className="text-sm font-medium text-white/90">{dim.name}</p>
                        <span className="rounded-full border border-white/10 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white/40">
                          {LAYER_LABELS[dim.layer]}
                        </span>
                      </div>
                      <ul className="mt-1.5 space-y-0.5">
                        {dim.evidence.map((e, i) => (
                          <li key={i} className="text-xs text-white/45">· {e}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-lg font-bold text-[#6efcff]">
                        {dim.score}/{dim.maxScore}
                      </p>
                      <p className="text-[10px] text-white/40">weight {dim.weight}%</p>
                    </div>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isIntegrity && dim.score <= 1 ? "bg-red-400" : "bg-[#6efcff]"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 px-5 py-4 font-mono text-xs text-white/40">
          Report generated: {new Date(report.timestamp).toLocaleString()} ·{" "}
          {report.analysisSource === "engine"
            ? "Scored via matdao-ip-engine (PatentSBERTa + FTO pipeline)"
            : "Client-side prototype scorer (backend was offline)"}
        </div>

        <Link
          href="/ai-studio/due-diligence/submit"
          className="inline-flex h-11 items-center rounded-full border border-white/20 px-6 text-sm text-white/70 transition-colors hover:text-white"
        >
          New Analysis
        </Link>
      </div>
    </div>
  )
}
