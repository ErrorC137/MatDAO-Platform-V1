"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Loader2, Target } from "lucide-react"
import { BackendStatus } from "@/components/ai-studio/BackendStatus"
import { analyzeTrl } from "@/lib/ai-studio/trl"

const SAMPLE_PAPERS: Record<string, { label: string; text: string }> = {
  battery: {
    label: "Energy — Solid-state battery prototype",
    text: `Abstract
An all-solid-state lithium metal battery using sulfide ceramic electrolyte achieves energy density above 400 Wh/kg. Coin-cell and pouch prototypes were assembled and validated in bench-scale testing environments, demonstrating TRL 5 performance baselines with 85% capacity retention after 500 cycles.`,
  },
  capture: {
    label: "Carbon — MOF pilot capture system",
    text: `Abstract
Copper-azolate MOF extrudates were deployed in a sub-scale flue chimney filter cartridge on active refinery gas outputs. A continuous 480-hour carbon scrubbing trial was completed, demonstrating operational pilot performance in relevant industrial environment.`,
  },
}

export default function TrlSubmitPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [textInput, setTextInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const runAnalysis = useCallback(
    async (uploadFile: File) => {
      setLoading(true)
      setError(null)
      try {
        const report = await analyzeTrl(uploadFile)
        sessionStorage.setItem("matdao-trl-report", JSON.stringify(report))
        router.push("/ai-studio/trl/results")
      } catch (err) {
        setError(err instanceof Error ? err.message : "TRL evaluation failed")
      } finally {
        setLoading(false)
      }
    },
    [router],
  )

  const handleSubmit = async () => {
    if (file) {
      await runAnalysis(file)
      return
    }
    if (textInput.trim()) {
      const blob = new Blob([textInput], { type: "text/plain" })
      await runAnalysis(new File([blob], "research-paper.txt", { type: "text/plain" }))
      return
    }
    setError("Please upload a file or paste your paper text.")
  }

  return (
    <div className="relative min-h-[70vh] px-5 py-12 sm:px-6">
      <div className="workflow-panel relative z-10 mx-auto max-w-3xl rounded-2xl p-6 sm:p-8">
        <p className="mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
          <Target className="h-3.5 w-3.5" />
          TRL Evaluation
        </p>
        <h1 className="font-headline mb-2 text-2xl font-bold text-white/95">Upload for TRL Assessment</h1>
        <p className="mb-6 text-sm text-white/60">
          Uses the matdao-ip-engine — same backend as IP Valuation and Due Diligence.
        </p>
        <BackendStatus />

        <div className="mb-4 mt-6 flex flex-wrap gap-2">
          {Object.entries(SAMPLE_PAPERS).map(([key, sample]) => (
            <button
              key={key}
              type="button"
              onClick={() => {
                setTextInput(sample.text)
                setFile(null)
              }}
              className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/60 hover:border-[#6efcff]/30 hover:text-[#c5fdff]"
            >
              {sample.label}
            </button>
          ))}
        </div>

        <div
          className={`mb-4 rounded-xl border-2 border-dashed p-8 text-center ${
            dragOver ? "border-[#6efcff]/50 bg-[#6efcff]/5" : "border-white/15 bg-black/20"
          }`}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragOver(false)
            const f = e.dataTransfer.files[0]
            if (f) setFile(f)
          }}
        >
          <FileUp className="mx-auto mb-2 h-8 w-8 text-white/40" />
          <p className="text-sm text-white/60">PDF, DOCX, or TXT</p>
          {file && <p className="mt-2 text-xs text-[#c5fdff]">{file.name}</p>}
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            className="mt-3 text-xs text-white/50"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <textarea
          className="mb-4 min-h-[160px] w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30"
          placeholder="Or paste abstract / paper text..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
        />

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6efcff]/20 py-3 text-sm font-semibold text-[#c5fdff] hover:bg-[#6efcff]/30 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Evaluating TRL...
            </>
          ) : (
            "Run TRL Evaluation"
          )}
        </button>
      </div>
    </div>
  )
}
