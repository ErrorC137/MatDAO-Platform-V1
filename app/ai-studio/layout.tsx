import type { Metadata } from "next"
import { AiStudioSubnav } from "@/components/ai-studio/AiStudioSubnav"

export const metadata: Metadata = {
  title: "AI Studio — MatDAO",
  description:
    "MatDAO AI Studio: IP valuation, FTO analysis, and scientific paper due diligence tools for research investment evaluation.",
}

export default function AiStudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="ai-studio min-h-[calc(100dvh-4rem)]">
      <AiStudioSubnav />
      {children}
    </div>
  )
}
