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
  Loader2,
  Gem,
  Sparkles,
  Clock,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react"
import { MarkdownReport } from "@/components/trl-services/MarkdownReport"
import { TrlBackendStatus } from "@/components/trl-services/TrlBackendStatus"
import { useAuth } from "@/context/auth-context"
import { supabase } from "@/lib/supabase/client"
import { MILESTONE_LABELS } from "@/lib/trl-services/storage"
import { useMintIPNFT } from "@/lib/web3/hooks/useMintIPNFT"
import { CONTRACT_ADDRESSES } from "@/lib/web3/config"
import { uploadMetadataToIPFSAction } from "@/lib/ipfs/uploadMetadataToIPFSAction"
import type { VerificationTask } from "@/lib/trl-services/types"

export default function AiAuditorPage() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [tasks, setTasks] = useState<VerificationTask[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [minting, setMinting] = useState(false)
  const [mintedProjectIds, setMintedProjectIds] = useState<Set<string>>(new Set())

  const { mintIPNFT, isPending: isMintingPending, isSuccess: isMintSuccess } = useMintIPNFT()

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
      // Fetch projects from Supabase
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('researcher_id', user?.id)
        .order('created_at', { ascending: false })

      if (projectError) throw projectError
      setProjects(projectData || [])

      // Fetch verification tasks from Supabase
      const { data: taskData, error: taskError } = await supabase
        .from('verification_tasks')
        .select('*')
        .order('submitted_at', { ascending: false })

      if (taskError) throw taskError

      const transformedTasks: VerificationTask[] = (taskData || []).map(t => ({
        id: t.id,
        title: t.title,
        milestoneName: t.milestone_name,
        projectId: t.project_id,
        projectTitle: t.project_title,
        proofText: t.proof_text,
        submittedBy: t.submitted_by,
        submittedAt: t.submitted_at,
        aiPassed: t.ai_passed,
        aiPlagiarismScore: t.ai_plagiarism_score,
        aiConsistencyReport: t.ai_consistency_report,
        humanVoted: t.human_voted,
        humanPassed: t.human_passed,
        humanNotes: t.human_notes,
        status: t.status,
      }))
      setTasks(transformedTasks)

      if (projectData && projectData.length > 0 && !projectId) setProjectId(projectData[0].id)
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

      // Insert into Supabase verification_tasks table
      const { data: taskData, error: insertError } = await supabase
        .from('verification_tasks')
        .insert({
          title,
          milestone_name: milestoneName,
          project_id: projectId,
          project_title: targetProject?.title || "Custom Project",
          proof_text: proofText,
          submitted_by: submittedBy || user?.name || "Researcher",
          ai_passed: false,
          ai_plagiarism_score: 0,
          ai_consistency_report: "Pending AI analysis...",
          status: "pending",
        })
        .select()
        .single()

      if (insertError) throw insertError

      const task: VerificationTask = {
        id: taskData.id,
        title: taskData.title,
        milestoneName: taskData.milestone_name,
        projectId: taskData.project_id,
        projectTitle: taskData.project_title,
        proofText: taskData.proof_text,
        submittedBy: taskData.submitted_by,
        submittedAt: taskData.submitted_at,
        aiPassed: taskData.ai_passed,
        aiPlagiarismScore: taskData.ai_plagiarism_score,
        aiConsistencyReport: taskData.ai_consistency_report,
        humanVoted: taskData.human_voted,
        humanPassed: taskData.human_passed,
        humanNotes: taskData.human_notes,
        status: taskData.status,
      }

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
      const { error } = await supabase
        .from('verification_tasks')
        .update({ proof_text: editProofText })
        .eq('id', editingTask.id)

      if (error) throw error

      setTasks((prev) =>
        prev.map((t) => (t.id === editingTask.id ? { ...t, proofText: editProofText } : t))
      )
      setEditingTask(null)
      setEditProofText("")
    } catch (err) {
      setError("Failed to update proof")
    }
  }

  async function handleApprove(task: VerificationTask) {
    try {
      const { error } = await supabase
        .from('verification_tasks')
        .update({
          status: "verified",
          human_passed: true,
          human_voted: true,
        })
        .eq('id', task.id)

      if (error) throw error

      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "verified", humanPassed: true, humanVoted: true } : t)))

      // Check if all verifications for this project are approved, then approve project
      const { data: projectData } = await supabase
        .from('projects')
        .select('*')
        .eq('id', task.projectId)
        .single()

      if (projectData && projectData.phase !== 'approved') {
        // Update project phase to approved
        await supabase
          .from('projects')
          .update({ phase: 'approved' })
          .eq('id', task.projectId)

        // Trigger IP-NFT minting if researcher has wallet connected
        if (projectData.researcher_id) {
          const { data: researcherData } = await supabase
            .from('profiles')
            .select('wallet_address')
            .eq('id', projectData.researcher_id)
            .single()

          if (researcherData?.wallet_address && !mintedProjectIds.has(task.projectId)) {
            await handleMintIPNFT(task.projectId, projectData, researcherData.wallet_address)
          }
        }
      }
    } catch (err) {
      setError("Failed to approve verification")
    }
  }

  async function handleMintIPNFT(projectId: string, projectData: any, walletAddress: string) {
    if (mintedProjectIds.has(projectId)) return

    setMinting(true)
    try {
      // Upload metadata to IPFS
      const metadataUri = await uploadMetadataToIPFSAction(
        {
          commercialViability: 85,
          scientificIntegrity: 90,
          ipNovelty: 88,
          validationTier: "Tier A"
        },
        {
          title: projectData.title,
          description: `MatDAO IP-NFT representing validated material science research: ${projectData.title}`,
          researchField: projectData.description?.[0]?.value || "Materials Science"
        }
      )

      // Mint IP-NFT
      await mintIPNFT({
        researcher: walletAddress as `0x${string}`,
        tokenURI: metadataUri,
        contractAddress: CONTRACT_ADDRESSES.MATDAO_IPNFT || "0x0000000000000000000000000000000000000000"
      })

      setMintedProjectIds(prev => new Set(prev).add(projectId))

      // Update project with NFT info
      await supabase
        .from('projects')
        .update({
          ip_status: {
            type: 'IP-NFT',
            status: 'minted',
            details: metadataUri
          }
        })
        .eq('id', projectId)

    } catch (err) {
      console.error("Error minting IP-NFT:", err)
      setError("Failed to mint IP-NFT")
    } finally {
      setMinting(false)
    }
  }

  async function handleReject(task: VerificationTask) {
    try {
      const { error } = await supabase
        .from('verification_tasks')
        .update({
          status: "rejected",
          human_passed: false,
          human_voted: true,
        })
        .eq('id', task.id)

      if (error) throw error

      setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, status: "rejected", humanPassed: false, humanVoted: true } : t)))
    } catch (err) {
      setError("Failed to reject verification")
    }
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <Shield className="h-3.5 w-3.5" />
            AI Scientific Auditor
          </div>
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
          
          {/* Stats Cards */}
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-[#6efcff]" />
                <span className="text-xs text-white/50">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white">{tasks.filter((t) => t.status === "pending").length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-400" />
                <span className="text-xs text-white/50">Verified</span>
              </div>
              <p className="text-2xl font-bold text-white">{tasks.filter((t) => t.status === "verified").length}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-[#a78bfa]" />
                <span className="text-xs text-white/50">AI Pass Rate</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {tasks.length > 0 ? Math.round((tasks.filter((t) => t.aiPassed).length / tasks.length) * 100) : 0}%
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 text-[#6efcff]" />
                <span className="text-xs text-white/50">NFTs Minted</span>
              </div>
              <p className="text-2xl font-bold text-white">{mintedProjectIds.size}</p>
            </div>
          </div>

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
                                disabled={minting}
                                className="rounded p-1.5 text-emerald-400 hover:bg-emerald-500/10 disabled:opacity-50"
                                title="Approve"
                              >
                                {minting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ThumbsUp className="h-3.5 w-3.5" />}
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
