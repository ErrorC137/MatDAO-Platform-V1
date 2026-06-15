"use client"

import Link from "next/link"
import { ArrowRight, Brain, FileSearch, Layers, Scale, Shield, Target } from "lucide-react"

const tool = {
  href: "/ai-studio/project-assessment",
  icon: Layers,
  badge: "All 3 Analyses",
  badgeColor: "#a78bfa",
  title: "Unified AI Analysis",
  description:
    "Run comprehensive research intelligence analysis in a single upload. Our matdao-ip-engine simultaneously performs TRL evaluation (NASA/EU scale classification with milestone roadmap), IP Valuation & FTO analysis (automated IPC/CPC classification, semantic originality scoring, FTO claim overlap analysis, and USD financial anchoring), and Scientific Due Diligence (9-dimension scoring for investment evaluation with integrity gate validation). Receive a detailed document with all three analyses, recommended next steps, and profile-ready milestone submissions.",
  features: [
    "TRL Evaluation: NASA/EU scale classification with commercialization milestone roadmap",
    "IP Valuation & FTO: Automated classification, originality scoring, risk analysis, USD anchoring",
    "Due Diligence: 9-dimension investment scoring with integrity gate validation",
    "Single backend call via matdao-ip-engine",
    "Comprehensive detailed document output",
    "Profile-ready milestone submissions",
  ],
  cta: "Run Unified Analysis",
}

export default function AiStudioPage() {
  return (
    <div className="relative px-5 py-12 sm:px-6 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
        <div className="absolute left-1/2 top-[-10%] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-300/3 blur-[160px]" />
        <div className="absolute bottom-[-18%] right-[4%] h-[560px] w-[560px] rounded-full bg-indigo-500/3 blur-[170px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Brain className="h-3.5 w-3.5" />
            MatDAO AI Studio
          </p>
          <h1 className="font-headline mb-3 text-4xl font-extrabold tracking-tight text-white/95 md:text-5xl">
            Unified Research Intelligence
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 md:text-lg">
            A single comprehensive analysis powered by the <strong className="text-white/85">matdao-ip-engine</strong>.
            Upload your research document once and receive TRL evaluation, IP valuation & FTO analysis, and scientific due
            diligence — all in one detailed report.
          </p>
        </div>

        <Link
          href={tool.href}
          className="group workflow-panel block rounded-2xl p-8 transition-all hover:-translate-y-1"
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#6efcff]/25 bg-[#6efcff]/10">
              <tool.icon className="h-6 w-6 text-[#6efcff]" />
            </div>
            <span
              className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-wider text-white/60"
              style={{ borderColor: `${tool.badgeColor}40` }}
            >
              {tool.badge}
            </span>
          </div>
          <h2 className="font-headline mb-4 text-3xl font-bold text-white/95">{tool.title}</h2>
          <p className="mb-6 text-base leading-relaxed text-white/70">{tool.description}</p>
          <div className="mb-8 space-y-2">
            {tool.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#6efcff]" />
                {f}
              </li>
            ))}
          </div>
          <div className="inline-flex items-center gap-2 text-base font-semibold text-[#c5fdff]">
            {tool.cta}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </div>
        </Link>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 px-6 py-5 text-center">
          <p className="text-xs text-white/50">
            Powered by <strong className="text-white/70">matdao-ip-engine</strong> (deploy on Render). A single{" "}
            <code className="text-white/60">/api/analyze</code> call returns comprehensive IP valuation, TRL evaluation,
            and due diligence data. Set <code className="text-white/60">IP_ENGINE_URL</code> in your hosting environment.
          </p>
        </div>
      </div>
    </div>
  )
}
