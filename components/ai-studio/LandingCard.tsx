"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

interface LandingCardProps {
  href: string
  badge: string
  badgeColor: string
  title: string
  description: string
  cta: string
  image: string
  gradient: string
  icon: React.ReactNode
}

export function LandingCard({
  href,
  badge,
  badgeColor,
  title,
  description,
  cta,
  image,
  gradient,
  icon,
}: LandingCardProps) {
  return (
    <Link href={href} className="group block rounded-2xl text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#6efcff]/50">
      <div
        className={`relative flex h-[260px] w-full flex-col justify-between overflow-hidden rounded-2xl border border-[#c8f9ff]/24 p-8 shadow-[0_12px_32px_rgba(0,0,0,0.38)] ring-1 ring-white/14 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.45)] md:h-[280px] ${gradient}`}
      >
        <img
          src={image}
          alt=""
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[0.68]"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/44 to-black/84" />
        <div className="pointer-events-none absolute -bottom-3 -right-3 z-[1] h-36 w-36 opacity-66">
          {icon}
        </div>
        <div className="pointer-events-none z-10 flex h-full flex-col">
          <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1 text-sm font-medium text-white/80 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: badgeColor }} />
            {badge}
          </div>
          <div className="flex-grow">
            <h3 className="font-headline mb-2 text-2xl font-bold text-white/92">{title}</h3>
            <p className="max-w-xs text-sm text-white/64">{description}</p>
          </div>
          <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/84">
            {cta}
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}
