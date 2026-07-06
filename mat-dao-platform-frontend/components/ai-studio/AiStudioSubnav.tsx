"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const tools = [
  { label: "Overview", href: "/ai-studio" },
  { label: "Unified Analysis", href: "/ai-studio/project-assessment" },
]

export function AiStudioSubnav() {
  const pathname = usePathname()

  return (
    <div className="border-b border-white/10 bg-gradient-to-r from-black/40 via-black/30 to-black/40 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-6 py-4">
        {tools.map((tool) => {
          const isActive =
            tool.href === "/ai-studio"
              ? pathname === "/ai-studio"
              : pathname.startsWith(tool.href)
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`relative shrink-0 rounded-2xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-[#6efcff]/25 to-[#6efcff]/10 text-[#c5fdff] shadow-lg shadow-[#6efcff]/15 border border-[#6efcff]/30"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
            >
              {tool.label}
              {isActive && (
                <>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#6efcff]/20 to-transparent rounded-2xl blur-xl opacity-50" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-transparent via-[#6efcff] to-transparent rounded-full" />
                </>
              )}
            </Link>
          )
        })}
        <div className="ml-auto shrink-0 rounded-2xl border border-white/15 bg-gradient-to-r from-white/10 to-white/5 px-4 py-2.5 backdrop-blur-sm">
          <span className="text-[11px] font-bold uppercase tracking-widest text-white/60">
            Prototype
          </span>
        </div>
      </div>
    </div>
  )
}
