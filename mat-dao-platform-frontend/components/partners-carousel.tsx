"use client"

import { useEffect, useState, useRef } from "react"

interface Partner {
  name: string
  logo: string
  url?: string
}

const PARTNERS: Partner[] = [
  { name: "1kx", logo: "https://cdn.prod.website-files.com/68270a6148d6b472673039a1/68270a6148d6b47267303c44_1kx-1.png", url: "https://1kx.network" },
  { name: "50y", logo: "https://cdn.prod.website-files.com/68270a6148d6b472673039a1/68270a6148d6b47267303c5f_50y.webp", url: "https://50y.com" },
  { name: "YZi Labs", logo: "https://cdn.prod.website-files.com/68270a6148d6b472673039a1/68270a6148d6b47267303c6f_YZi_Labs_Logo_3.webp", url: "https://yzi.io" },
  { name: "Coinbase", logo: "https://cdn.prod.website-files.com/68270a6148d6b472673039a1/68270a6148d6b47267303c7c_coinbase.webp", url: "https://coinbase.com" },
  { name: "a16z", logo: "https://cdn.prod.website-files.com/68270a6148d6b472673039a1/68270a6148d6b47267303c8a_a16z.webp", url: "https://a16z.com" },
  { name: "Paradigm", logo: "https://cdn.prod.website-files.com/68270a6148d6b472673039a1/68270a6148d6b47267303c98_paradigm.webp", url: "https://paradigm.xyz" },
  { name: "Binance Labs", logo: "https://cdn.prod.website-files.com/68270a6148d6b472673039a1/68270a6148d6b47267303ca6_binance.webp", url: "https://binance.com" },
  { name: "Polychain", logo: "https://cdn.prod.website-files.com/68270a6148d6b472673039a1/68270a6148d6b47267303cb4_polychain.webp", url: "https://polychain.capital" },
]

export function PartnersCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const scrollContainer = scrollRef.current
    if (!scrollContainer) return

    let animationFrameId: number
    let scrollPosition = 0

    const scroll = () => {
      if (!isPaused) {
        scrollPosition += 0.5
        if (scrollPosition >= scrollContainer.scrollWidth / 2) {
          scrollPosition = 0
        }
        scrollContainer.scrollLeft = scrollPosition
      }
      animationFrameId = requestAnimationFrame(scroll)
    }

    animationFrameId = requestAnimationFrame(scroll)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [isPaused])

  return (
    <div className="w-full overflow-hidden bg-gradient-to-r from-[#0a0a0a] via-[#0d1a2d] to-[#0a0a0a] py-12">
      <div className="container mx-auto px-4 mb-8">
        <h3 className="text-center text-2xl font-bold text-white/90 mb-2">Building with the best</h3>
        <p className="text-center text-sm text-white/60">Top crypto and biotech players are backing projects in the MatDAO ecosystem.</p>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-16 overflow-x-hidden px-12"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {[...PARTNERS, ...PARTNERS].map((partner, index) => (
          <a
            key={`${partner.name}-${index}`}
            href={partner.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 transition-transform hover:scale-110"
          >
            <img
              src={partner.logo}
              alt={partner.name}
              className="h-16 w-auto max-w-48 object-contain opacity-60 hover:opacity-100 transition-opacity"
            />
          </a>
        ))}
      </div>
    </div>
  )
}
