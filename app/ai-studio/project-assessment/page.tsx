"use client"

import Link from "next/link"
import { ArrowRight, FileSearch, Layers } from "lucide-react"

export default function ProjectAssessmentPage() {
  return (
    <div className="relative px-5 py-12 sm:px-6 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Layers className="h-3.5 w-3.5" />
            Unified Assessment
          </p>
          <h1 className="font-headline mb-3 text-4xl font-extrabold text-white/95">Project Assessment Report</h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70">
            Merges TRL evaluation, IP valuation, and scientific due diligence into one detailed report with
            recommended milestone next steps you can submit to your profile.
          </p>
        </div>

        <Link
          href="/ai-studio/project-assessment/submit"
          className="group workflow-panel block rounded-2xl p-8 transition-all hover:-translate-y-1"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#6efcff]/25 bg-[#6efcff]/10">
            <FileSearch className="h-6 w-6 text-[#6efcff]" />
          </div>
          <span className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-wider text-white/60">
            TRL + IP + DD
          </span>
          <h2 className="font-headline mb-2 mt-4 text-2xl font-bold text-white/95">Full Project Assessment</h2>
          <p className="mb-5 text-sm leading-relaxed text-white/60">
            Upload a paper or paste your abstract. Runs TRL classification, IP valuation & FTO, and 9-dimension
            due diligence in one unified commercialization report.
          </p>
          <ul className="mb-6 space-y-1.5">
            {["TRL level & milestone roadmap", "IP valuation & FTO risk", "Due diligence scoring", "Profile-ready next steps"].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                <span className="h-1 w-1 rounded-full bg-[#6efcff]" />
                {f}
              </li>
            ))}
          </ul>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#c5fdff]">
            Start Assessment
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 px-6 py-5 text-center text-xs text-white/50">
          Requires <strong className="text-white/70">matdao-ip-engine</strong> deployed (e.g. Render). Set{" "}
          <code className="text-white/60">IP_ENGINE_URL</code> in your hosting environment.
        </div>
      </div>
    </div>
  )
}
