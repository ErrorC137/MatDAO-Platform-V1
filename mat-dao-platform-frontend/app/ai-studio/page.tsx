"use client"

import Link from "next/link"
import { ArrowRight, Brain, Scale, Shield } from "lucide-react"

const tools = [
  {
    href: "/ai-studio/valuation",
    icon: Scale,
    badge: "4-Layer Engine",
    badgeColor: "#6efcff",
    title: "IP Valuation & FTO",
    description:
      "Automated IPC/CPC classification, semantic originality scoring, FTO claim overlap analysis, and USD financial anchoring for tokenization-ready deep tech IP.",
    features: ["PatentSBERTa embeddings", "FTO risk scoring", "HITL tokenization sliders"],
    cta: "Start IP Valuation",
  },
  {
    href: "/ai-studio/due-diligence",
    icon: Shield,
    badge: "9-Dimension Model",
    badgeColor: "#f59e0b",
    title: "Scientific Paper Due Diligence",
    description:
      "Automated 9-dimension scoring for scientific research investment evaluation — from NLP evidence extraction through integrity gate validation.",
    features: ["Evidence extraction", "API enrichment", "Integrity gate (Dim9)"],
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

      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Brain className="h-3.5 w-3.5" />
            MatDAO AI Studio
          </p>
          <h1 className="font-headline mb-3 text-4xl font-extrabold tracking-tight text-white/95 md:text-5xl">
            Research Intelligence Tools
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 md:text-lg">
            Unified AI-powered evaluation suite for deep tech IP. Value your research, assess freedom-to-operate,
            and run investment-grade due diligence — all within the MatDAO platform.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group workflow-panel rounded-2xl p-6 transition-all hover:-translate-y-1 md:p-8"
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
              <h2 className="font-headline mb-2 text-2xl font-bold text-white/95">{tool.title}</h2>
              <p className="mb-5 text-sm leading-relaxed text-white/60">{tool.description}</p>
              <ul className="mb-6 space-y-1.5">
                {tool.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                    <span className="h-1 w-1 rounded-full bg-[#6efcff]" />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#c5fdff]">
                {tool.cta}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/3 px-6 py-5 text-center">
          <p className="text-xs text-white/50">
            Both tools use the <strong className="text-white/70">matdao-ip-engine</strong> backend for PDF/DOCX parsing,
            PatentSBERTa embeddings, and FTO analysis. Start it on port 8765 before uploading real files.
          </p>
        </div>
      </div>
    </div>
  )
}
