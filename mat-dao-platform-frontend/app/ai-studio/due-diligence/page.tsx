"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { LandingCard } from "@/components/ai-studio/LandingCard"

const TYPEWRITER_WORDS = ["research paper", "preprint", "technical report"]

export default function DueDiligenceLandingPage() {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = TYPEWRITER_WORDS[wordIndex]
    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          setDisplayText(current.slice(0, displayText.length + 1))
          if (displayText === current) {
            setTimeout(() => setIsDeleting(true), 1800)
          }
        } else {
          setDisplayText(current.slice(0, displayText.length - 1))
          if (displayText === "") {
            setIsDeleting(false)
            setWordIndex((i) => (i + 1) % TYPEWRITER_WORDS.length)
          }
        }
      },
      isDeleting ? 40 : 80,
    )
    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, wordIndex])

  return (
    <div className="relative px-5 py-12 pb-28 sm:px-6 md:py-16 md:pb-20">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
        <div className="absolute bottom-[-18%] right-[4%] h-[560px] w-[560px] rounded-full bg-indigo-500/3 blur-[170px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <div className="mb-8 text-center md:mb-10">
          <p className="mb-4 inline-flex items-center rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            4-Layer Scientific Due Diligence
          </p>
          <h1 className="font-headline mb-3 flex min-h-[90px] flex-col items-center justify-center text-4xl font-extrabold tracking-tight text-white/95 md:min-h-[120px] md:text-6xl">
            <span>
              Score your{" "}
              <span className="text-[#89fdff]">{displayText}</span>
              <span className="animate-pulse text-[#89fdff]">|</span>
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 md:text-lg">
            Start from one pathway and we&apos;ll guide you from evidence extraction to decision-ready
            9-dimension scoring with integrity gate validation.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:mb-14 md:grid-cols-3 md:gap-8">
          <LandingCard
            href="/ai-studio/due-diligence/submit"
            badge="Prototype pick"
            badgeColor="#f59e0b"
            title="Evaluate my research"
            description="Run structured due diligence from extraction to integrity gate with evidence traces."
            cta="Start evaluation"
            image="https://images.unsplash.com/photo-1581092335397-9583eb92d232?auto=format&fit=crop&w=900&q=80"
            gradient="bg-gradient-to-br from-[#24170d]/96 via-[#2a1a0d]/95 to-[#2f1d0e]/93"
            icon={
              <svg viewBox="0 0 220 220" className="h-full w-full opacity-90" fill="none">
                <circle cx="124" cy="104" r="34" stroke="rgba(255,196,143,0.98)" strokeWidth="4.6" opacity="0.74" />
                <path d="M78 150L102 126L126 150L148 122" stroke="rgba(255,196,143,0.98)" strokeWidth="3.6" strokeLinecap="round" opacity="0.74" />
              </svg>
            }
          />
          <LandingCard
            href="/ai-studio/due-diligence/submit"
            badge="Signal check"
            badgeColor="#64748b"
            title="See my research's strength"
            description="Benchmark quality, defensibility, and investment confidence against market expectations."
            cta="Benchmark now"
            image="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80"
            gradient="bg-gradient-to-br from-[#131a25]/96 via-[#192232]/95 to-[#1d2739]/93"
            icon={
              <svg viewBox="0 0 220 220" className="h-full w-full opacity-90" fill="none">
                <rect x="46" y="122" width="20" height="28" rx="6" fill="rgba(141,219,246,0.22)" stroke="rgba(183,244,255,0.98)" strokeWidth="2.6" />
                <rect x="80" y="102" width="20" height="48" rx="6" fill="rgba(141,219,246,0.22)" stroke="rgba(183,244,255,0.98)" strokeWidth="2.6" />
                <rect x="114" y="82" width="20" height="68" rx="6" fill="rgba(141,219,246,0.22)" stroke="rgba(183,244,255,0.98)" strokeWidth="2.6" />
                <rect x="148" y="62" width="20" height="88" rx="6" fill="rgba(141,219,246,0.22)" stroke="rgba(183,244,255,0.98)" strokeWidth="2.6" />
              </svg>
            }
          />
          <LandingCard
            href="/ai-studio/due-diligence/submit"
            badge="Market fit"
            badgeColor="#8b5cf6"
            title="Find industry/investor fit"
            description="Match your paper with demand signals, investor interest, and strategic partner pathways."
            cta="Map demand"
            image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80"
            gradient="bg-gradient-to-br from-[#1b1328]/96 via-[#231a34]/95 to-[#2b1f40]/93"
            icon={
              <svg viewBox="0 0 220 220" className="h-full w-full opacity-90" fill="none">
                <path d="M42 162L90 122L130 142L178 94" stroke="rgba(199,178,255,0.98)" strokeWidth="4.6" strokeLinecap="round" opacity="0.74" />
                <circle cx="178" cy="94" r="16" fill="rgba(181,162,255,0.23)" stroke="rgba(199,178,255,0.98)" strokeWidth="2.8" />
              </svg>
            }
          />
        </div>

        <div className="flex flex-col items-center gap-5">
          <Link href="/ai-studio/due-diligence/submit" className="inline-flex">
            <button type="button" className="glass-btn relative inline-flex h-12 cursor-pointer items-center justify-center rounded-full px-10 text-sm font-medium text-white transition duration-300 hover:scale-105">
              Start Prototype Evaluation
            </button>
          </Link>
          <div className="grid w-full max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-white/15 bg-white/4 px-4 py-3 text-xs text-white/70 backdrop-blur-sm">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b8fcff]">Layer 1</div>
              <div>NLP extraction from paper evidence</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/4 px-4 py-3 text-xs text-white/70 backdrop-blur-sm">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b8fcff]">Layer 2</div>
              <div>API enrichment from trusted sources</div>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/4 px-4 py-3 text-xs text-white/70 backdrop-blur-sm">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#b8fcff]">Integrity Gate</div>
              <div>Dim9 = 1 forces total score to 0</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
