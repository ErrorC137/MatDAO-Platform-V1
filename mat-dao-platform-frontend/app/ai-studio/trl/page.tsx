"use client"

import Link from "next/link"
import { ArrowRight, Target } from "lucide-react"

export default function TrlLandingPage() {
  return (
    <div className="relative px-5 py-12 sm:px-6 md:py-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
          <Target className="h-3.5 w-3.5" />
          TRL Evaluation
        </p>
        <h1 className="font-headline mb-3 text-4xl font-extrabold text-white/95 md:text-5xl">
          Technology Readiness Assessment
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-sm text-white/70 md:text-base">
          Upload your research paper or technical report. The same matdao-ip-engine pipeline used for IP
          valuation and due diligence also classifies your TRL level and maps commercialization milestones.
        </p>
        <Link
          href="/ai-studio/trl/submit"
          className="inline-flex items-center gap-2 rounded-full bg-[#6efcff]/20 px-8 py-3 text-sm font-semibold text-[#c5fdff] hover:bg-[#6efcff]/30"
        >
          Start TRL Evaluation
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-6 text-xs text-white/45">
          Or run all three tools at once via{" "}
          <Link href="/ai-studio/project-assessment" className="text-[#c5fdff] underline">
            Unified Project Assessment
          </Link>
        </p>
      </div>
    </div>
  )
}
