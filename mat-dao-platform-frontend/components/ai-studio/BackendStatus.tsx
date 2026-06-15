"use client"

import { useEffect, useState } from "react"
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { checkBackendHealth, type BackendHealth } from "@/lib/ai-studio/api"

export function BackendStatus({ required = true }: { required?: boolean }) {
  const [health, setHealth] = useState<BackendHealth | null>(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true
    checkBackendHealth().then((h) => {
      if (mounted) {
        setHealth(h)
        setChecking(false)
      }
    })
    return () => {
      mounted = false
    }
  }, [])

  if (checking) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-3 text-xs text-white/50">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Checking IP Engine backend...
      </div>
    )
  }

  if (!health?.reachable) {
    return (
      <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
          <div className="text-xs text-amber-200/90">
            <p className="font-semibold text-amber-200">
              {required ? "IP Engine backend is offline" : "IP Engine backend is offline (limited mode)"}
            </p>
            <p className="mt-1 text-amber-200/70">
              {required
                ? "PDF and DOCX uploads require the matdao-ip-engine service. Set IP_ENGINE_URL in your hosting environment."
                : "PDF/DOCX need the backend. Plain text paste still works in limited mode."}
            </p>
            {health?.backend_url && (
              <code className="mt-2 block rounded bg-black/30 px-2 py-1.5 font-mono text-[10px] text-amber-100/80">
                {health.backend_url}
              </code>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (!health.index_ready) {
    return (
      <div className="mb-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200/80">
        <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-400" />
        Patent index builds on first analysis (OpenAI embeddings). Submit a document to warm the index.
      </div>
    )
  }

  return (
    <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/8 px-4 py-3 text-xs text-emerald-300/90">
      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
      IP Engine connected · {health.patent_corpus_size ?? 0} patents indexed ·{" "}
      {health.embedding_model ?? "text-embedding-3-small"} ready
    </div>
  )
}
