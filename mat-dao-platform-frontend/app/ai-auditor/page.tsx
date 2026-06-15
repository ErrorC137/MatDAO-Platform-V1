"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  AlertTriangle,
  CheckCircle,
  Send,
  Shield,
  ShieldAlert,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  FileEdit,
} from "lucide-react"
import { MarkdownReport } from "@/components/trl-services/MarkdownReport"
import { TrlBackendStatus } from "@/components/trl-services/TrlBackendStatus"
import { useAuth } from "@/context/auth-context"
import { fetchProjects, fetchVerifications, submitVerification } from "@/lib/trl-services/api"
import { MILESTONE_LABELS } from "@/lib/trl-services/storage"
import type { TrlProject, VerificationTask } from "@/lib/trl-services/types"

export default function AiAuditorPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<TrlProject[]>([])
  const [tasks, setTasks] = useState<VerificationTask[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [title, setTitle] = useState("")
  const [submittedBy, setSubmittedBy] = useState(user?.name || "")
  const [milestoneName, setMilestoneName] = useState("prototype")
  const [projectId, setProjectId] = useState("")
  const [proofText, setProofText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [lastSubmitted, setLastSubmitted] = useState<VerificationTask | null>(null)
  const [editingTask, setEditingTask] = useState<VerificationTask | null>(null)
  const [editProofText, setEditProofText] = useState("")

  async function loadData() {
    setLoading(true)
    try {
      const [projs, verifs] = await Promise.all([fetchProjects(), fetchVerifications()])
      setProjects(projs)
      setTasks(verifs)
      if (projs.length > 0 && !projectId) setProjectId(projs[0].id)
    } catch {
      setError("Failed to load auditor data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title || !proofText || !projectId) {
      setError("Title, proof text, and project are required.")
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const targetProject = projects.find((p) => p.id === projectId)
      const task = await submitVerification({
        title,
        milestoneName,
        projectId,
        projectTitle: targetProject?.title || "Custom Project",
        proofText,
        submittedBy: submittedBy || user?.name || "Researcher",
      })
      setLastSubmitted(task)
      setTitle("")
      setProofText("")
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  function handleEdit(task: VerificationTask) {
    setEditingTask(task)
    setEditProofText(task.proofText)
  }

  async function handleSaveEdit() {
    if (!editingTask || !editProofText) return
    try {
      // In a real implementation, this would call an API to update the proof
      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, proofText: editProofText } : t))
      )
      setEditingTask(null)
      setEditProofText("")
    } catch (err) {
      setError("Failed to update proof")
    }
  }

  function handleApprove(task: VerificationTask) {
    // In a real implementation, this would call an API to approve the verification
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "verified", humanPassed: true, humanVoted: true } : t)))
  }

  function handleReject(task: VerificationTask) {
    // In a real implementation, this would call an API to reject the verification
    setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "rejected", humanPassed: false, humanVoted: true } : t)))
  }

  function statusIcon(task: VerificationTask) {
    if (task.status === "verified") return <CheckCircle className="h-4 w-4 text-emerald-400" />
    if (task.status === "rejected") return <XCircle className="h-4 w-4 text-red-400" />
    if (task.status === "flagged") return <ShieldAlert className="h-4 w-4 text-amber-400" />
    return <AlertTriangle className="h-4 w-4 text-white/40" />
  }

  const isStaff = user?.role === "staff"
  const isResearcher = user?.role === "researcher"

  return (
    <div className="relative min-h-[calc(100dvh-4rem)] px-5 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Shield className="h-3.5 w-3.5" />
            AI Scientific Auditor
          </p>
          <h1 className="font-headline mb-2 text-3xl font-extrabold text-white/95">
            {isStaff ? "Staff Verification Dashboard" : "Milestone Proof Verification"}
          </h1>
          <p className="max-w-2xl text-sm text-white/60">
            {isStaff
              ? "Review and approve or reject milestone verification submissions from researchers. AI provides initial screening, staff make final decisions."
              : "Submit milestone methodology proof for automated anomaly detection, plagiarism screening, and thermodynamic consistency checks. Results appear on your "}
            {!isStaff && (
              <Link href="/submit/milestone" className="text-[#c5fdff] underline">
                milestone page
              </Link>
            )}
            {!isStaff && "."}
          </p>
          <div className="mt-4">
            <TrlBackendStatus />
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {isResearcher && (
            <form onSubmit={handleSubmit} className="workflow-panel space-y-4 rounded-2xl p-6">
              <h2 className="font-headline text-lg font-bold text-white/95">Submit Proof for Audit</h2>
              <select
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <select
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white"
                value={milestoneName}
                onChange={(e) => setMilestoneName(e.target.value)}
              >
                {Object.entries(MILESTONE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                placeholder="Claim title *"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <input
                className="w-full rounded-lg border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder:text-white/30"
                placeholder="Submitted by"
                value={submittedBy}
                onChange={(e) => setSubmittedBy(e.target.value)}
              />
              <textarea
                className="min-h-[160px] w-full rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-sm text-white placeholder:text-white/30"
                placeholder="Methodology proof and experimental results *"
                value={proofText}
                onChange={(e) => setProofText(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#6efcff]/20 px-6 py-2.5 text-sm font-semibold text-[#c5fdff] hover:bg-[#6efcff]/30 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                {submitting ? "Auditing..." : "Run AI Audit"}
              </button>
            </form>
          )}

          {isStaff && (
            <div className="workflow-panel space-y-4 rounded-2xl p-6">
              <h2 className="font-headline text-lg font-bold text-white/95">Staff Actions</h2>
              <p className="text-sm text-white/60">
                Review pending verifications below. Use the approve/reject buttons to make final decisions on milestone
                submissions.
              </p>
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50">
                  <strong className="text-white/70">Pending:</strong> {tasks.filter((t) => t.status === "pending").length}{" "}
                  submissions awaiting review
                </p>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {lastSubmitted && isResearcher && (
              <div className="workflow-panel rounded-2xl p-6">
                <h2 className="mb-3 font-headline text-lg font-bold text-white/95">Latest Audit Result</h2>
                <div className="mb-3 flex items-center gap-2">
                  {lastSubmitted.aiPassed ? (
                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">AI Passed</span>
                  ) : (
                    <span className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">AI Flagged</span>
                  )}
                  <span className="text-xs text-white/50">
                    Plagiarism risk: {lastSubmitted.aiPlagiarismScore}%
                  </span>
                </div>
                <MarkdownReport content={lastSubmitted.aiConsistencyReport} />
              </div>
            )}

            <div className="workflow-panel rounded-2xl p-6">
              <h2 className="mb-4 font-headline text-lg font-bold text-white/95">
                {isStaff ? "All Verification Submissions" : "Audit History"}
              </h2>
              {loading ? (
                <p className="text-sm text-white/50">Loading...</p>
              ) : (
                <div className="max-h-[500px] space-y-3 overflow-y-auto">
                  {tasks.map((task) => (
                    <div key={task.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-white/90">{task.title}</h3>
                          <p className="text-xs text-white/45">
                            {task.projectTitle} · {MILESTONE_LABELS[task.milestoneName] || task.milestoneName}
                          </p>
                          <p className="mt-2 text-xs text-white/55 line-clamp-2">{task.proofText}</p>
                        </div>
                        {statusIcon(task)}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <div className="flex gap-2 text-[10px]">
                          <span
                            className={`rounded px-2 py-0.5 ${task.aiPassed ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}
                          >
                            AI: {task.aiPassed ? "Pass" : "Fail"}
                          </span>
                          <span className="rounded bg-white/5 px-2 py-0.5 text-white/50">
                            {task.status}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {isResearcher && task.status === "pending" && (
                            <button
                              onClick={() => handleEdit(task)}
                              className="rounded p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
                              title="Edit proof"
                            >
                              <FileEdit className="h-3.5 w-3.5" />
                            </button>
                          )}
                          {isStaff && task.status === "pending" && (
                            <>
                              <button
                                onClick={() => handleApprove(task)}
                                className="rounded p-1.5 text-emerald-400 hover:bg-emerald-500/10"
                                title="Approve"
                              >
                                <ThumbsUp className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleReject(task)}
                                className="rounded p-1.5 text-red-400 hover:bg-red-500/10"
                                title="Reject"
                              >
                                <ThumbsDown className="h-3.5 w-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                      {editingTask?.id === task.id && (
                        <div className="mt-3 space-y-2">
                          <textarea
                            className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs text-white"
                            value={editProofText}
                            onChange={(e) => setEditProofText(e.target.value)}
                            rows={4}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="rounded-full bg-[#6efcff]/20 px-3 py-1 text-xs font-semibold text-[#c5fdff] hover:bg-[#6efcff]/30"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingTask(null)
                                setEditProofText("")
                              }}
                              className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/60 hover:bg-white/10"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
