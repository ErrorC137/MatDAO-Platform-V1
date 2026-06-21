"use client"

import Link from "next/link"
import { ArrowRight, Brain, FileSearch, Layers, Scale, Shield, Target, BookOpen } from "lucide-react"

const tools = [
  {
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
  },
  {
    href: "/ai-studio/trl",
    icon: Target,
    badge: "TRL Only",
    badgeColor: "#6efcff",
    title: "TRL Evaluation",
    description:
      "Evaluate your technology's readiness level using the NASA TRL scale. Get a detailed commercialization roadmap with specific milestones to advance from lab to market.",
    features: [
      "NASA TRL scale classification (TRL 1-9)",
      "Commercialization milestone roadmap",
      "Gap analysis and next steps",
      "Timeline estimates for each TRL level",
    ],
    cta: "Start TRL Evaluation",
  },
  {
    href: "/ai-studio/valuation",
    icon: Scale,
    badge: "IP Valuation",
    badgeColor: "#f59e0b",
    title: "IP Valuation & FTO",
    description:
      "Comprehensive intellectual property valuation with freedom-to-operate analysis. Automated patent classification, novelty scoring, and financial anchoring.",
    features: [
      "Automated IPC/CPC patent classification",
      "Semantic originality and novelty scoring",
      "FTO claim overlap analysis",
      "USD financial valuation anchoring",
    ],
    cta: "Start IP Valuation",
  },
  {
    href: "/ai-studio/due-diligence",
    icon: Shield,
    badge: "Due Diligence",
    badgeColor: "#10b981",
    title: "Scientific Due Diligence",
    description:
      "9-dimension scientific integrity assessment for investment evaluation. Includes integrity gate validation and comprehensive scoring.",
    features: [
      "9-dimension scientific scoring",
      "Integrity gate validation",
      "Investment tier classification",
      "Risk assessment and recommendations",
    ],
    cta: "Start Due Diligence",
  },
]

export default function AiStudioPage() {
  return (
    <div className="relative px-5 py-12 sm:px-6 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
        <div className="absolute left-1/2 top-[-10%] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-300/3 blur-[160px]" />
        <div className="absolute bottom-[-18%] right-[4%] h-[560px] w-[560px] rounded-full bg-indigo-500/3 blur-[170px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Brain className="h-3.5 w-3.5" />
            MatDAO AI Studio
          </p>
          <h1 className="font-headline mb-3 text-4xl font-extrabold tracking-tight text-white/95 md:text-5xl">
            Research Intelligence Tools
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 md:text-lg">
            Choose your analysis approach: run all three tools together for comprehensive insights, or use individual tools for specific needs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="workflow-panel group block rounded-2xl p-6 transition-all hover:-translate-y-1"
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
              <h2 className="font-headline mb-3 text-2xl font-bold text-white/95">{tool.title}</h2>
              <p className="mb-4 text-sm leading-relaxed text-white/70">{tool.description}</p>
              <div className="mb-6 space-y-2">
                {tool.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-xs text-white/60">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-[#6efcff]" />
                    {f}
                  </li>
                ))}
              </div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#c5fdff]">
                {tool.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 px-6 py-5 text-center">
          <p className="text-xs text-white/50">
            Powered by <strong className="text-white/70">matdao-ip-engine</strong> (deploy on Render). A single{" "}
            <code className="text-white/60">/api/analyze</code> call returns comprehensive IP valuation, TRL evaluation,
            and due diligence data. Set <code className="text-white/60">IP_ENGINE_URL</code> in your hosting environment.
          </p>
          <p className="mt-2 text-xs text-white/50">
            New to MatDAO? <Link href="/guide" className="text-[#c5fdff] underline">Read the User Guide</Link> for detailed instructions on using all features.
          </p>
        </div>
      </div>
    </div>
  )
}
