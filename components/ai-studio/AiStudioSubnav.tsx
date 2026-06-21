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
    <div className="border-b border-white/10 bg-black/30 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-2">
        {tools.map((tool) => {
          const isActive =
            tool.href === "/ai-studio"
              ? pathname === "/ai-studio"
              : pathname.startsWith(tool.href)
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-[#6efcff]/15 text-[#c5fdff]"
                  : "text-white/50 hover:text-white/80"
              }`}
            >
              {tool.label}
            </Link>
          )
        })}
        <span className="ml-auto shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-wider text-white/50">
          Prototype
        </span>
      </div>
    </div>
  )
}
