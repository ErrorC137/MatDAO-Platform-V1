"use client"

import { useState } from "react"
import { ChevronDown, ChevronRight, FileSearch } from "lucide-react"
import { formatUsd } from "@/lib/ai-studio/api"
import type { AuditEntry } from "@/lib/ai-studio/types"

export function AuditableValue({
  entry,
  defaultOpen = false,
}: {
  entry: AuditEntry
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const isDeduction = entry.amount_usd < 0

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-white/2">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-white/3"
      >
        <div className="flex min-w-0 items-center gap-2">
          {open ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-[#6efcff]" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-white/40" />
          )}
          <span className="truncate text-sm text-white/80">{entry.label}</span>
        </div>
        <span className={`shrink-0 font-mono text-sm ${isDeduction ? "text-amber-300" : "text-white/90"}`}>
          {isDeduction ? "−" : ""}
          {formatUsd(Math.abs(entry.amount_usd))}
        </span>
      </button>

      {open && (
        <div className="space-y-3 border-t border-white/8 px-4 pb-4 pt-3">
          <p className="text-xs leading-relaxed text-white/60">{entry.explanation}</p>
          <div className="rounded-lg bg-black/30 px-3 py-2">
            <p className="mb-1 text-[10px] uppercase tracking-wider text-[#6efcff]/70">Formula</p>
            <p className="font-mono text-xs text-white/75">{entry.formula}</p>
          </div>
          {entry.calculation_steps.length > 0 && (
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-wider text-white/40">Calculation steps</p>
              <ol className="space-y-1">
                {entry.calculation_steps.map((step) => (
                  <li key={step.step} className="flex gap-2 text-xs text-white/55">
                    <span className="w-4 font-mono text-white/30">{step.step}.</span>
                    <span>
                      <span className="text-white/70">{step.operation}:</span>{" "}
                      <span className="font-mono">{String(step.value)}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {entry.evidence.length > 0 && (
            <div>
              <p className="mb-2 flex items-center gap-1 text-[10px] uppercase tracking-wider text-white/40">
                <FileSearch className="h-3 w-3" /> Evidence & references
              </p>
              <ul className="space-y-1">
                {entry.evidence.map((ev, i) => (
                  <li key={i} className="text-xs text-white/50">
                    <span className="font-mono text-[#6efcff]/80">{ev.type}</span>
                    {ev.ref && <span className="text-white/60"> · {ev.ref}</span>}
                    {ev.detail && <span className="text-white/40"> — {ev.detail}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
