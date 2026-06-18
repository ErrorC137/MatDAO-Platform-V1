"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Save, Target, Gem, Loader2, Download } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { formatUsd } from "@/lib/ai-studio/api"
import { addAssessment, addSubmittedMilestone, MILESTONE_LABELS } from "@/lib/trl-services/storage"
import { uploadMetadataToIPFSAction } from "@/lib/ipfs/uploadMetadataToIPFSAction"
import { useMintIPNFT } from "@/lib/web3/hooks/useMintIPNFT"
import { CONTRACT_ADDRESSES } from "@/lib/web3/config"
import type { CombinedAssessmentReport } from "@/lib/trl-services/types"
import { generateReportPDF } from "@/lib/pdf/generateReportPDF"

export default function ProjectAssessmentResultsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [report, setReport] = useState<CombinedAssessmentReport | null>(null)
  const [saved, setSaved] = useState(false)
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  const [nftTokenId, setNftTokenId] = useState<string | null>(null)
  const [ipfsUri, setIpfsUri] = useState<string | null>(null)

  const { mintIPNFT, isPending: isMintingPending, isSuccess: isMintSuccess } = useMintIPNFT()

  useEffect(() => {
    const raw = sessionStorage.getItem("matdao-combined-report")
    if (!raw) {
      router.replace("/ai-studio/project-assessment/submit")
      return
    }
    setReport(JSON.parse(raw))
  }, [router])

  async function handleMintIPNFT() {
    if (!report || !user?.walletAddress) return

    setMinting(true)
    try {
      // Upload metadata to IPFS using server action
      const metadataUri = await uploadMetadataToIPFSAction(
        {
          commercialViability: report.summary.ipScore,
          scientificIntegrity: report.summary.dueDiligenceScore || 85,
          ipNovelty: report.summary.ipScore,
          validationTier: report.summary.investmentTier === "pass" ? "Tier A" : report.summary.investmentTier === "review" ? "Tier B" : "Tier C"
        },
        {
          title: report.title,
          description: `MatDAO IP-NFT representing validated material science research: ${report.title}`,
          researchField: report.category
        }
      )
      setIpfsUri(metadataUri)

      // Mint IP-NFT
      await mintIPNFT({
        researcher: user.walletAddress as `0x${string}`,
        tokenURI: metadataUri,
        contractAddress: CONTRACT_ADDRESSES.MATDAO_IPNFT || "0x0000000000000000000000000000000000000000"
      })

      setMinted(true)
      setNftTokenId("1") // This would come from the contract event in production
    } catch (error) {
      console.error("Error minting IP-NFT:", error)
      alert("Failed to mint IP-NFT. Please ensure you have a wallet connected and the contract is deployed.")
    } finally {
      setMinting(false)
    }
  }

  function downloadPDF() {
    if (!report) return
    generateReportPDF(report)
  }

  function saveToProfile() {
    if (!report || !user) return
    addAssessment(user.id, report)

    Object.entries(report.trlProject.milestones).forEach(([key, m]) => {
      if (m.status === "current" || m.status === "future") {
        addSubmittedMilestone(user.id, {
          id: `ms-${Date.now()}-${key}`,
          projectId: report.trlProject.id,
          projectTitle: report.title,
          milestoneKey: key as keyof typeof report.trlProject.milestones,
          milestoneLabel: MILESTONE_LABELS[key] || key,
          description: m.description,
          timeline: m.timeline,
          status: m.status,
          submittedAt: new Date().toISOString(),
          submittedBy: user.name,
        })
      }
    })

    setSaved(true)
  }

  if (!report) return null

  return (
    <div className="relative px-5 py-12 sm:px-6">
      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-[11px] uppercase tracking-wider text-[#c5fdff]">Detailed Assessment Report</p>
            <h1 className="font-headline text-2xl font-bold text-white/95 md:text-3xl">{report.title}</h1>
            <p className="mt-1 text-sm text-white/50">
              {report.author} · {report.category}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 rounded-full border border-[#6efcff]/40 bg-[#6efcff]/10 px-5 py-2 text-sm font-semibold text-[#c5fdff] hover:bg-[#6efcff]/20"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            {user ? (
              <button
                type="button"
                onClick={saveToProfile}
                disabled={saved}
                className="inline-flex items-center gap-2 rounded-full border border-[#6efcff]/40 bg-[#6efcff]/10 px-5 py-2 text-sm font-semibold text-[#c5fdff] hover:bg-[#6efcff]/20 disabled:opacity-60"
              >
                {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? "Saved to Profile" : "Save to Profile"}
              </button>
            ) : (
              <Link
                href="/auth/sign-in"
                className="rounded-full border border-white/20 px-5 py-2 text-sm text-white/70"
              >
                Sign in to save
              </Link>
            )}
            {user?.walletAddress && !minted && (
              <button
                type="button"
                onClick={handleMintIPNFT}
                disabled={minting || isMintingPending}
                className="inline-flex items-center gap-2 rounded-full border border-[#f59e0b]/40 bg-[#f59e0b]/10 px-5 py-2 text-sm font-semibold text-[#f59e0b] hover:bg-[#f59e0b]/20 disabled:opacity-60"
              >
                {minting || isMintingPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Gem className="h-4 w-4" />
                )}
                {minting || isMintingPending ? "Minting..." : "Mint IP-NFT"}
              </button>
            )}
            {minted && (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-400">
                <Check className="h-4 w-4" />
                IP-NFT Minted #{nftTokenId}
              </div>
            )}
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <Metric label="TRL Level" value={`TRL ${report.summary.trl}`} />
          <Metric label="Innovation Score" value={String(report.summary.ipScore)} />
          <Metric
            label="IP Valuation"
            value={report.summary.valuationUsd ? formatUsd(report.summary.valuationUsd) : "N/A"}
          />
          <Metric
            label="Due Diligence"
            value={
              report.summary.dueDiligenceScore !== null
                ? `${report.summary.dueDiligenceScore.toFixed(0)}%`
                : "N/A"
            }
          />
        </div>

        <section className="workflow-panel mb-6 rounded-2xl p-6">
          <h2 className="mb-3 flex items-center gap-2 font-headline text-lg font-bold text-white/95">
            <Target className="h-5 w-5 text-[#6efcff]" />
            TRL Summary
          </h2>
          <p className="text-sm text-white/70">{report.trlProject.trlSummary}</p>
          <ul className="mt-4 space-y-1">
            {report.trlProject.accomplishments.map((a) => (
              <li key={a} className="text-xs text-white/55">
                · {a}
              </li>
            ))}
          </ul>
        </section>

        <section className="workflow-panel mb-6 rounded-2xl p-6">
          <h2 className="mb-4 font-headline text-lg font-bold text-white/95">Milestone Roadmap</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(report.trlProject.milestones).map(([key, m]) => (
              <div key={key} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase text-white/70">
                    {MILESTONE_LABELS[key] || key}
                  </span>
                  <span className="font-mono text-[10px] text-[#6efcff]">{m.status}</span>
                </div>
                <p className="mt-2 text-xs text-white/60">{m.description}</p>
                <p className="mt-1 font-mono text-[10px] text-white/40">{m.timeline}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="workflow-panel mb-6 rounded-2xl p-6">
          <h2 className="mb-3 font-headline text-lg font-bold text-white/95">Recommended Next Steps</h2>
          <ul className="space-y-2">
            {report.summary.recommendedNextSteps.map((step) => (
              <li key={step} className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/65">
                {step}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-white/45">
            Submit milestone proofs via the{" "}
            <Link href="/ai-auditor" className="text-[#c5fdff] underline">
              AI Auditor
            </Link>{" "}
            — results will appear on your{" "}
            <Link href="/submit/milestone" className="text-[#c5fdff] underline">
              milestone page
            </Link>
            .
          </p>
        </section>

        {report.ipReport && (
          <section className="workflow-panel mb-6 rounded-2xl p-6">
            <h2 className="mb-3 font-headline text-lg font-bold text-white/95">IP & FTO Analysis</h2>
            <p className="text-sm text-white/60">
              Sector: {report.ipReport.classification.sector_name} · FTO risk:{" "}
              {(report.ipReport.fto.r_fto * 100).toFixed(0)}% · Target valuation:{" "}
              {formatUsd(report.ipReport.valuation.v_target_usd)}
            </p>
          </section>
        )}

        {report.dueDiligenceReport && (
          <section className="workflow-panel mb-6 rounded-2xl p-6">
            <h2 className="mb-3 font-headline text-lg font-bold text-white/95">Due Diligence</h2>
            <p className="text-sm text-white/60">
              Total score: {report.dueDiligenceReport.totalScore.toFixed(1)}% · Tier:{" "}
              <span className="uppercase text-[#c5fdff]">{report.dueDiligenceReport.investmentTier}</span>
            </p>
          </section>
        )}

        <section className="workflow-panel rounded-2xl p-6">
          <h2 className="mb-4 font-headline text-lg font-bold text-white/95">Comprehensive Analysis Document</h2>
          <div className="space-y-6 text-sm text-white/70">
            {ipfsUri && (
              <div className="rounded-lg border border-[#f59e0b]/30 bg-[#f59e0b]/5 p-4">
                <h3 className="mb-2 font-semibold text-[#f59e0b]">IP-NFT Metadata</h3>
                <p className="text-xs text-white/60 break-all">IPFS URI: {ipfsUri}</p>
                {minted && (
                  <p className="mt-2 text-xs text-emerald-400">✓ Successfully minted as IP-NFT #{nftTokenId}</p>
                )}
              </div>
            )}
            <div>
              <h3 className="mb-2 font-semibold text-white/90">Project Overview</h3>
              <p className="mb-2"><strong>Title:</strong> {report.title}</p>
              <p className="mb-2"><strong>Author:</strong> {report.author}</p>
              <p><strong>Category:</strong> {report.category}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-white/90">TRL Evaluation Analysis</h3>
              <p className="mb-2"><strong>TRL Level:</strong> {report.summary.trl}</p>
              <p className="mb-2"><strong>TRL Summary:</strong> {report.trlProject.trlSummary}</p>
              <p className="mb-2"><strong>Key Accomplishments:</strong></p>
              <ul className="ml-4 space-y-1">
                {report.trlProject.accomplishments.map((a, i) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-white/90">Milestone Roadmap</h3>
              <div className="space-y-2">
                {Object.entries(report.trlProject.milestones).map(([key, m]) => (
                  <div key={key} className="rounded-lg border border-white/10 bg-black/20 p-3">
                    <p className="font-semibold text-white/90">{MILESTONE_LABELS[key] || key}</p>
                    <p className="text-xs text-white/60">{m.description}</p>
                    <p className="text-xs text-white/40 mt-1">Timeline: {m.timeline}</p>
                    <p className="text-xs text-[#6efcff] mt-1">Status: {m.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {report.ipReport && (
              <div>
                <h3 className="mb-2 font-semibold text-white/90">IP Valuation & FTO Analysis</h3>
                <p className="mb-2"><strong>Sector:</strong> {report.ipReport.classification.sector_name}</p>
                <p className="mb-2"><strong>FTO Risk Score:</strong> {(report.ipReport.fto.r_fto * 100).toFixed(2)}%</p>
                <p className="mb-2"><strong>Target Valuation:</strong> {formatUsd(report.ipReport.valuation.v_target_usd)}</p>
                <p className="mb-2"><strong>Classification:</strong> {report.ipReport.classification.ipc_primary}</p>
              </div>
            )}

            {report.dueDiligenceReport && (
              <div>
                <h3 className="mb-2 font-semibold text-white/90">Scientific Due Diligence Analysis</h3>
                <p className="mb-2"><strong>Total Due Diligence Score:</strong> {report.dueDiligenceReport.totalScore.toFixed(2)}%</p>
                <p className="mb-2"><strong>Investment Tier:</strong> <span className="uppercase text-[#c5fdff]">{report.dueDiligenceReport.investmentTier}</span></p>
                <p className="mb-2"><strong>Integrity Gate Status:</strong> {report.dueDiligenceReport.integrityGateTriggered ? "Triggered" : "Not Triggered"}</p>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-semibold text-white/90">Summary Metrics</h3>
              <p className="mb-2"><strong>Innovation Score:</strong> {report.summary.ipScore}</p>
              <p className="mb-2"><strong>IP Valuation:</strong> {report.summary.valuationUsd ? formatUsd(report.summary.valuationUsd) : "N/A"}</p>
              <p><strong>Due Diligence Score:</strong> {report.summary.dueDiligenceScore !== null ? `${report.summary.dueDiligenceScore.toFixed(2)}%` : "N/A"}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-white/90">Recommended Actions</h3>
              <ul className="ml-4 space-y-1">
                {report.summary.recommendedNextSteps.map((step, i) => (
                  <li key={i}>• {step}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/30 p-4 text-center">
      <p className="text-[10px] uppercase tracking-wider text-white/45">{label}</p>
      <p className="mt-1 font-headline text-lg font-bold text-white/90">{value}</p>
    </div>
  )
}
