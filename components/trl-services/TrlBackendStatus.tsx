"use client"

import { useEffect, useState } from "react"
import { Loader2, Server } from "lucide-react"
import { checkTrlServicesHealth } from "@/lib/trl-services/api"

export function TrlBackendStatus() {
  const [status, setStatus] = useState<"loading" | "ok" | "error">("loading")
  const [gemini, setGemini] = useState(false)

  useEffect(() => {
    checkTrlServicesHealth()
      .then((data) => {
        setStatus("ok")
        setGemini(data.gemini_configured)
      })
      .catch(() => setStatus("error"))
  }, [])

  if (status === "loading") {
    return (
      <div className="flex items-center gap-2 text-xs text-white/50">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Checking TRL Services...
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
        TRL Services offline — set <code className="text-red-200">TRL_SERVICES_URL</code> in your hosting
        environment to your deployed Render URL.
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 rounded-lg border border-[#6efcff]/20 bg-[#6efcff]/5 px-3 py-2 text-xs text-[#c5fdff]">
      <Server className="h-3.5 w-3.5" />
      TRL Services connected {gemini ? "(Gemini AI)" : "(heuristic mode)"}
    </div>
  )
}
