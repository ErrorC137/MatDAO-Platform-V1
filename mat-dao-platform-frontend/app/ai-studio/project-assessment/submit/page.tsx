"use client"

import { useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Loader2 } from "lucide-react"
import { BackendStatus } from "@/components/ai-studio/BackendStatus"
import { runCombinedAssessment } from "@/lib/trl-services/combined-report"

export default function ProjectAssessmentSubmitPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [category, setCategory] = useState("Deep Tech")
  const [textContent, setTextContent] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)

  const runAssessment = useCallback(async () => {
    if (!title.trim() || (!textContent.trim() && !file)) {
      setError("Provide a title and abstract text or upload a file.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const report = await runCombinedAssessment({
        title,
        author,
        category,
        textContent: textContent || (file ? await file.text() : ""),
        file,
      })
      sessionStorage.setItem("matdao-combined-report", JSON.stringify(report))
      router.push("/ai-studio/project-assessment/results")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Assessment failed")
    } finally {
      setLoading(false)
    }
  }, [title, author, category, textContent, file, router])

  return (
    <div className="relative px-5 py-12 sm:px-6">
      <div className="relative z-10 mx-auto max-w-3xl">
        <h1 className="font-headline mb-2 text-2xl font-bold text-white/95">Submit for Assessment</h1>
        <p className="mb-6 text-sm text-white/60">
          One upload runs all three tools via a single matdao-ip-engine analysis.
        </p>

        <div className="mb-6">
          <BackendStatus />
        </div>

        <div className="workflow-panel space-y-4 rounded-2xl p-6">
          <input
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
            placeholder="Project title *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
            placeholder="Author / Institution"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          <select
            className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option>Deep Tech</option>
            <option>Energy Storage</option>
            <option>Carbon Capture</option>
            <option>AI Materials</option>
            <option>Biomaterials</option>
            <option>Advanced Materials</option>
          </select>

          <div
            className={`rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
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
            <p className="text-sm text-white/60">Drop PDF, DOCX, or TXT (optional if pasting below)</p>
            {file && <p className="mt-2 text-xs text-[#c5fdff]">{file.name}</p>}
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              className="mt-3 text-xs text-white/50"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <textarea
            className="min-h-[200px] w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30"
            placeholder="Paste abstract or scientific content *"
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
          />

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="button"
            onClick={runAssessment}
            disabled={loading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#6efcff]/20 py-3 text-sm font-semibold text-[#c5fdff] hover:bg-[#6efcff]/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running full assessment...
              </>
            ) : (
              "Generate Detailed Report"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
