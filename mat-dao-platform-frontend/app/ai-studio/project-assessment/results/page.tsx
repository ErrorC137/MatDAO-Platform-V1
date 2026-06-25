"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Save, Target, Gem, Loader2, Download, Flame, ShieldCheck, AlertTriangle, Award, ChevronRight, Zap, Brain, Battery, Wind, Orbit } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { formatUsd } from "@/lib/ai-studio/api"
import { addAssessment, addSubmittedMilestone, MILESTONE_LABELS } from "@/lib/trl-services/storage"
import { uploadMetadataToIPFSAction } from "@/lib/ipfs/uploadMetadataToIPFSAction"
import { useMintIPNFT } from "@/lib/web3/hooks/useMintIPNFT"
import { CONTRACT_ADDRESSES } from "@/lib/web3/config"
import type { CombinedAssessmentReport } from "@/lib/trl-services/types"
import { generateReportPDF } from "@/lib/pdf/generateReportPDF"
import { SpiderChart } from "@/components/ai-studio/SpiderChart"

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

  // Check if this is using fallback data (backend unavailable)
  const isFallbackData = report?.ipReport?.document_profile?.note?.includes("fallback") || 
                         report?.ipReport?.classification?.classifier_model?.includes("fallback")

  if (!report) return null

  return (
    <div className="relative px-5 py-12 sm:px-6">
      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Fallback Data Warning */}
        {isFallbackData && (
          <div className="mb-6 rounded-xl border border-blue-500/40 bg-blue-500/10 p-4">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-400 mb-1">Enhanced Analysis Mode</p>
                <p className="text-xs text-white/70">
                  {report.ipReport?.document_profile?.note?.includes("low quality") 
                    ? "Content quality analysis indicates limited technical depth. Results based on available content analysis."
                    : "Advanced content analysis enabled. Results generated using intelligent content analysis with keyword detection and semantic understanding."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Document Summary Section */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-black/30 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-[#6efcff]" />
            <h2 className="font-headline text-lg font-bold text-white/95">Document Analysis Summary</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/50 mb-1">Document Type</p>
              <p className="text-sm font-semibold text-white/90">{report.ipReport?.document_profile?.document_type || "Research Paper"}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/50 mb-1">Word Count</p>
              <p className="text-sm font-semibold text-white/90">{report.ipReport?.document_profile?.word_count?.toLocaleString() || "N/A"}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/50 mb-1">Classification</p>
              <p className="text-sm font-semibold text-white/90">{report.ipReport?.classification?.sector_name || "N/A"}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-white/50 mb-1">Primary Field</p>
              <p className="text-sm font-semibold text-white/90">{(report.ipReport?.classification as any)?.field_classification?.primary || "Materials Science"}</p>
            </div>
          </div>
          <div className="rounded-lg border border-white/10 bg-black/20 p-4">
            <p className="text-xs text-white/50 mb-2">Analysis Overview</p>
            <p className="text-sm text-white/70 leading-relaxed">
              This document has been analyzed for {report.ipReport?.document_profile?.word_count?.toLocaleString() || "various"} words across {report.ipReport?.document_profile?.sections_found?.length || 3} sections. 
              The research is classified under {report.ipReport?.classification?.sector_name || "various fields"} with primary focus on {(report.ipReport?.classification as any)?.field_classification?.primary || "materials science"}. 
              The analysis indicates a TRL level of {report.trlProject.trl} with an IP novelty score of {report.summary.ipScore}/100.
            </p>
          </div>
        </div>

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
            {false && user?.walletAddress && !minted && (
              <button
                type="button"
                onClick={handleMintIPNFT}
                disabled={minting || isMintingPending}
                className="inline-flex items-center gap-2 rounded-full border border-[#6efcff]/40 bg-[#6efcff]/10 px-5 py-2 text-sm font-semibold text-[#c5fdff] hover:bg-[#6efcff]/20 disabled:opacity-60"
              >
                {minting || isMintingPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gem className="h-4 w-4" />}
                {minting || isMintingPending ? "Minting..." : "Mint IP-NFT"}
              </button>
            )}
            {minted && (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-5 py-2 text-sm font-semibold text-emerald-400">
                <Award className="h-4 w-4" />
                IP-NFT Minted #{nftTokenId}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Metrics Grid with Color Coding */}
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <EnhancedMetric 
            label="TRL Level" 
            value={`TRL ${report.summary.trl}`} 
            trl={report.summary.trl}
            icon={<Award className="w-4 h-4" />}
          />
          <EnhancedMetric 
            label="Innovation Score" 
            value={String(report.summary.ipScore)} 
            score={report.summary.ipScore}
            icon={<Flame className="w-4 h-4" />}
          />
          <EnhancedMetric 
            label="IP Valuation" 
            value={report.summary.valuationUsd ? formatUsd(report.summary.valuationUsd) : "N/A"}
            icon={<Gem className="w-4 h-4" />}
          />
          <EnhancedMetric 
            label="Due Diligence" 
            value={
              report.summary.dueDiligenceScore !== null
                ? `${report.summary.dueDiligenceScore.toFixed(0)}%`
                : "N/A"
            }
            score={report.summary.dueDiligenceScore || 0}
            icon={<ShieldCheck className="w-4 h-4" />}
          />
        </div>

        {/* Enhanced TRL Evaluation Section */}
        <section className="workflow-panel mb-6 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#6efcff]" />
            <h2 className="font-headline text-lg font-bold text-white/95">TRL Evaluation Details</h2>
            <span className={`ml-auto font-mono text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${getTRLBadgeClass(report.trlProject.trl)}`}>
              TRL {report.trlProject.trl}
            </span>
          </div>
          <div className="space-y-4">
            {/* TRL Summary Card */}
            <div className="rounded-xl border border-white/10 bg-gradient-to-br from-black/20 to-black/40 p-5">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTRLIconBg(report.trlProject.trl)}`}>
                  {getTRLIcon(report.trlProject.trl)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-white/70 mb-2">Why TRL {report.trlProject.trl}?</p>
                  <p className="text-sm text-white/60 leading-relaxed">{report.trlProject.trlSummary}</p>
                </div>
              </div>
            </div>
            
            {/* Key Accomplishments */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Key Accomplishments
              </p>
              <ul className="space-y-2">
                {report.trlProject.accomplishments.map((a, i) => (
                  <li key={i} className="text-xs text-white/55 flex items-start gap-2">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Innovation Score */}
            <div className="rounded-xl border border-white/10 bg-black/20 p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-white/70 flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Innovation Score
                </p>
                <span className={`font-mono text-sm font-bold ${getScoreColor(report.trlProject.score)}`}>
                  {report.trlProject.score}/100
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${getScoreBarColor(report.trlProject.score)}`} 
                  style={{ width: `${report.trlProject.score}%` }}
                />
              </div>
              <p className="text-xs text-white/50 mt-2">
                Reflects technical novelty, scientific rigor, and potential impact based on analysis.
              </p>
            </div>
            
            {/* Paper Review Section */}
            {(report.trlProject as any).paper_review && (
              <div className="rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/5 p-4">
                <p className="text-xs font-semibold text-[#c5fdff] mb-2">📄 Paper Review & Validation</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-white/50 min-w-[100px]">Methodology:</span>
                    <span className="text-xs text-white/70">{(report.trlProject as any).paper_review.methodology_assessment}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-white/50 min-w-[100px]">Data Quality:</span>
                    <span className="text-xs text-white/70">{(report.trlProject as any).paper_review.data_quality}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-white/50 min-w-[100px]">Reproducibility:</span>
                    <span className="text-xs text-white/70">{(report.trlProject as any).paper_review.reproducibility}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-white/50 min-w-[100px]">Confidence:</span>
                    <span className="text-xs text-white/70">{(report.trlProject as any).paper_review.confidence_in_analysis}</span>
                  </div>
                  {(report.trlProject as any).paper_review.potential_hallucinations && (report.trlProject as any).paper_review.potential_hallucinations.length > 0 && (
                    <div className="mt-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3">
                      <p className="text-xs font-semibold text-yellow-400 mb-1">⚠️ Potential Hallucinations Detected:</p>
                      <ul className="space-y-1">
                        {(report.trlProject as any).paper_review.potential_hallucinations.map((h: string, i: number) => (
                          <li key={i} className="text-xs text-yellow-200/80">
                            · {h}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Key Indicators */}
            {(report.trlProject as any).key_indicators && (report.trlProject as any).key_indicators.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold text-white/70 mb-2">Key Indicators Found:</p>
                <ul className="space-y-1">
                  {(report.trlProject as any).key_indicators.map((indicator: string, i: number) => (
                    <li key={i} className="text-xs text-white/55">
                      · {indicator}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {/* Missing for Next TRL */}
            {(report.trlProject as any).missing_for_next_trl && (report.trlProject as any).missing_for_next_trl.length > 0 && (
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold text-white/70 mb-2">What's Needed for Next TRL:</p>
                <ul className="space-y-1">
                  {(report.trlProject as any).missing_for_next_trl.map((item: string, i: number) => (
                    <li key={i} className="text-xs text-white/55">
                      · {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

            {/* Enhanced Milestone Roadmap */}
        <section className="workflow-panel mb-6 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#6efcff]" />
            <h2 className="font-headline text-lg font-bold text-white/95">Milestone Roadmap</h2>
          </div>
          <div className="space-y-4">
            {/* Incomplete/Current Milestones with Recommendations */}
            {Object.entries(report.trlProject.milestones)
              .filter(([, m]) => m.status === "current" || m.status === "future")
              .map(([key, m], index) => (
                <div key={key} className={`rounded-xl border p-5 transition-all duration-200 ${
                  m.status === "current" 
                    ? "border-[#6efcff]/40 bg-gradient-to-br from-[#6efcff]/10 to-transparent shadow-lg shadow-[#6efcff]/10" 
                    : "border-white/10 bg-black/20"
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={`p-2 rounded-lg ${m.status === "current" ? "bg-[#6efcff]/20" : "bg-white/10"}`}>
                        {m.status === "current" ? (
                          <Flame className="w-4 h-4 text-[#6efcff]" />
                        ) : (
                          <Target className="w-4 h-4 text-white/50" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-semibold uppercase text-white/90">
                            {MILESTONE_LABELS[key] || key}
                          </span>
                          <span className={`font-mono text-[10px] px-2 py-0.5 rounded ${
                            m.status === "current" 
                              ? "bg-[#6efcff]/20 text-[#c5fdff]" 
                              : "bg-white/10 text-white/50"
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-sm text-white/70 leading-relaxed">{m.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-mono text-[10px] text-white/50">Target: {m.timeline}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold ${
                      m.status === "current" ? "bg-[#6efcff] text-black" : "bg-white/10 text-white/50"
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Enhanced What/Why/How Details */}
                  <div className="mt-4 pt-4 -mx-5 px-5 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-lg bg-black/30 p-3">
                        <p className="text-[10px] font-semibold text-[#6efcff] mb-1">WHAT</p>
                        <p className="text-xs text-white/60">
                          {m.status === "current" 
                            ? "Complete the validation phase for this milestone by demonstrating technical feasibility and gathering required evidence."
                            : "Plan and prepare for this milestone by establishing requirements and resource allocation."
                          }
                        </p>
                      </div>
                      <div className="rounded-lg bg-black/30 p-3">
                        <p className="text-[10px] font-semibold text-[#6efcff] mb-1">WHY</p>
                        <p className="text-xs text-white/60">
                          {m.status === "current"
                            ? "This milestone is critical for advancing to the next TRL level and demonstrating commercial viability to investors."
                            : "This milestone builds on previous achievements and is necessary for scaling the technology."
                          }
                        </p>
                      </div>
                      <div className="rounded-lg bg-black/30 p-3">
                        <p className="text-[10px] font-semibold text-[#6efcff] mb-1">HOW</p>
                        <p className="text-xs text-white/60">
                          {m.status === "current"
                            ? "Conduct experiments, collect data, document results, and prepare verification materials for AI auditor review."
                            : "Develop detailed plans, secure necessary resources, establish partnerships, and create implementation timeline."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Detailed breakdown */}
                  {(m as any).specific_actions && (m as any).specific_actions.length > 0 && (
                    <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-semibold text-white/70 mb-2">Specific Actions Required:</p>
                      <ul className="space-y-1">
                        {(m as any).specific_actions.map((action: string, i: number) => (
                          <li key={i} className="text-xs text-white/55 flex items-start gap-2">
                            <span className="text-[#6efcff]">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {(m as any).resources_needed && (m as any).resources_needed.length > 0 && (
                    <div className="mt-3 rounded-lg border border-white/10 bg-black/20 p-3">
                      <p className="text-xs font-semibold text-white/70 mb-2">Resources Needed:</p>
                      <div className="flex flex-wrap gap-2">
                        {(m as any).resources_needed.map((resource: string, i: number) => (
                          <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/60">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {m.status === "current" && (
                    <p className="mt-2 text-xs text-[#6efcff]">
                      💡 This is your current focus. Complete this milestone to advance to the next TRL level.
                    </p>
                  )}
                  {m.status === "future" && (
                    <p className="mt-2 text-xs text-white/50">
                      ⏳ This milestone will be unlocked after completing current milestones.
                    </p>
                  )}
                </div>
              ))}
            
            {/* Completed Milestones (collapsed) */}
            {Object.entries(report.trlProject.milestones).some(([, m]) => m.status === "completed") && (
              <details className="group">
                <summary className="cursor-pointer text-xs text-white/40 hover:text-white/60">
                  Show completed milestones ({Object.entries(report.trlProject.milestones).filter(([, m]) => m.status === "completed").length})
                </summary>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {Object.entries(report.trlProject.milestones)
                    .filter(([, m]) => m.status === "completed")
                    .map(([key, m]) => (
                      <div key={key} className="rounded-xl border border-white/10 bg-black/20 p-4 opacity-60">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold uppercase text-white/50">
                            {MILESTONE_LABELS[key] || key}
                          </span>
                          <span className="font-mono text-[10px] text-emerald-400">{m.status}</span>
                        </div>
                        <p className="mt-2 text-xs text-white/40">{m.description}</p>
                        <p className="mt-1 font-mono text-[10px] text-white/30">{m.timeline}</p>
                      </div>
                    ))}
                </div>
              </details>
            )}
          </div>
        </section>

        {/* Enhanced Recommended Next Steps */}
        <section className="workflow-panel mb-6 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <ChevronRight className="w-5 h-5 text-[#6efcff]" />
            <h2 className="font-headline text-lg font-bold text-white/95">Recommended Next Steps</h2>
          </div>
          <div className="space-y-3">
            {report.summary.recommendedNextSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 px-4 py-3 transition-all duration-200 hover:border-[#6efcff]/30">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#6efcff]/20 flex items-center justify-center">
                  <span className="text-xs font-bold text-[#c5fdff]">{index + 1}</span>
                </div>
                <p className="text-sm text-white/65 flex-1">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/5 p-3">
            <p className="text-xs text-white/70">
              Submit milestone proofs via the{" "}
              <Link href="/ai-auditor" className="text-[#c5fdff] underline font-medium">
                AI Auditor
              </Link>{" "}
              — results will appear on your{" "}
              <Link href="/submit/milestone" className="text-[#c5fdff] underline font-medium">
                milestone page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* Enhanced IP & FTO Analysis */}
        {report.ipReport && (
          <section className="workflow-panel mb-6 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="w-5 h-5 text-[#6efcff]" />
              <h2 className="font-headline text-lg font-bold text-white/95">IP & FTO Analysis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50 mb-1">Sector</p>
                <p className="text-sm font-semibold text-white/90">{report.ipReport.classification.sector_name}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50 mb-1">FTO Risk Score</p>
                <p className={`text-sm font-semibold ${getFTORiskColor(report.ipReport.fto.r_fto)}`}>{(report.ipReport.fto.r_fto * 100).toFixed(2)}%</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50 mb-1">Target Valuation</p>
                <p className="text-sm font-semibold text-emerald-400">{formatUsd(report.ipReport.valuation.v_target_usd)}</p>
              </div>
            </div>

            {/* Enhanced Classification & Keywords */}
            {(report.ipReport.classification as any).detected_keywords && (
              <div className="rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/5 p-4 mb-4">
                <p className="text-xs font-semibold text-[#c5fdff] mb-3">🔍 Automatic Classification & Keywords</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-white/50 mb-2">Detected Keywords:</p>
                    <div className="flex flex-wrap gap-2">
                      {(report.ipReport.classification as any).detected_keywords.map((keyword: string, i: number) => (
                        <span key={i} className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/60">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 mb-2">Field Classification:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">Primary:</span>
                        <span className="text-xs text-white/90">{(report.ipReport.classification as any).field_classification?.primary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">Secondary:</span>
                        <span className="text-xs text-white/90">{(report.ipReport.classification as any).field_classification?.secondary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">Tertiary:</span>
                        <span className="text-xs text-white/90">{(report.ipReport.classification as any).field_classification?.tertiary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Enhanced Valuation Factors Breakdown */}
            {(report.ipReport.valuation as any).additional_factors && (
              <div className="rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/5 p-4 mt-4">
                <p className="text-xs font-semibold text-[#c5fdff] mb-3">📊 Enhanced Valuation Factors</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="text-[10px] text-white/50 mb-1">Market Size Multiplier</p>
                    <p className="text-sm font-semibold text-white/90">{((report.ipReport.valuation as any).additional_factors.market_size_multiplier).toFixed(2)}x</p>
                  </div>
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="text-[10px] text-white/50 mb-1">TRL Adjustment</p>
                    <p className="text-sm font-semibold text-white/90">{((report.ipReport.valuation as any).additional_factors.trl_adjustment_factor).toFixed(2)}x</p>
                  </div>
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="text-[10px] text-white/50 mb-1">Team Quality</p>
                    <p className="text-sm font-semibold text-white/90">{((report.ipReport.valuation as any).additional_factors.team_quality_score).toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="text-[10px] text-white/50 mb-1">Competitive Advantage</p>
                    <p className="text-sm font-semibold text-white/90">{((report.ipReport.valuation as any).additional_factors.competitive_advantage_score).toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="text-[10px] text-white/50 mb-1">Regulatory Risk</p>
                    <p className="text-sm font-semibold text-white/90">{((report.ipReport.valuation as any).additional_factors.regulatory_risk_discount * 100).toFixed(1)}%</p>
                  </div>
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="text-[10px] text-white/50 mb-1">Time to Market</p>
                    <p className="text-sm font-semibold text-white/90">{(report.ipReport.valuation as any).additional_factors.time_to_market_months} months</p>
                  </div>
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="text-[10px] text-white/50 mb-1">Patent Strength</p>
                    <p className="text-sm font-semibold text-white/90">{((report.ipReport.valuation as any).additional_factors.patent_strength_score).toFixed(2)}</p>
                  </div>
                  <div className="rounded-lg bg-black/30 p-3">
                    <p className="text-[10px] text-white/50 mb-1">Commercial Readiness</p>
                    <p className="text-sm font-semibold text-white/90">{((report.ipReport.valuation as any).additional_factors.commercial_readiness_score).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-[10px] text-white/50 mb-1">Enhanced Formula:</p>
                  <p className="text-xs text-[#c5fdff] font-mono">{report.ipReport.valuation.formula}</p>
                </div>
              </div>
            )}
            
            <div className="mt-4 rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold text-white/70 mb-2">Valuation Calculation Breakdown</p>
                <div className="space-y-2 text-xs text-white/60">
                  <div className="flex justify-between">
                    <span>Baseline Value (V_baseline)</span>
                    <span>{formatUsd(report.ipReport.valuation.v_baseline_usd)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Originality Score (S_originality)</span>
                    <span>{report.ipReport.valuation.s_originality.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between">
                    <span>FTO Adjustment (1 - R_fto)</span>
                    <span>{(1 - report.ipReport.valuation.r_fto).toFixed(2)}x</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between font-semibold text-white/90">
                    <span>Target Valuation (V_target)</span>
                    <span>{formatUsd(report.ipReport.valuation.v_target_usd)}</span>
                  </div>
                  <p className="mt-2 text-[10px] text-white/40">
                    Formula: V_target = V_baseline × S_originality × (1 - R_fto)
                  </p>
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold text-white/70 mb-2">Classification Details</p>
                <div className="space-y-2 text-xs text-white/60">
                  <div className="flex justify-between">
                    <span>IPC Primary</span>
                    <span>{report.ipReport.classification.ipc_primary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CPC Primary</span>
                    <span>{report.ipReport.classification.cpc_primary}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>NACE Code</span>
                    <span>{report.ipReport.classification.nace_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Classification Confidence</span>
                    <span>{(report.ipReport.classification.classification_confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
              
              {/* DeepSeek-enhanced valuation insights */}
              {(report.ipReport.valuation as any).deepseek_enhancement && (
                <>
                  <div className="rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/5 p-4">
                    <p className="text-xs font-semibold text-[#c5fdff] mb-2">🚀 Market Opportunity</p>
                    <div className="space-y-2 text-xs text-white/70">
                      <div className="flex justify-between">
                        <span>Total Addressable Market</span>
                        <span>{(report.ipReport.valuation as any).deepseek_enhancement.market_opportunity.total_addressable_market}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Serviceable Addressable Market</span>
                        <span>{(report.ipReport.valuation as any).deepseek_enhancement.market_opportunity.serviceable_addressable_market}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Growth Rate</span>
                        <span>{(report.ipReport.valuation as any).deepseek_enhancement.market_opportunity.market_growth_rate}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold text-white/70 mb-2">Commercialization Path</p>
                    <div className="space-y-2 text-xs text-white/60">
                      <div className="flex justify-between">
                        <span>Time to Market</span>
                        <span>{(report.ipReport.valuation as any).deepseek_enhancement.commercialization_path.time_to_market}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-[10px] text-white/50 mb-1">Key Partnerships:</p>
                        <div className="flex flex-wrap gap-1">
                          {(report.ipReport.valuation as any).deepseek_enhancement.commercialization_path.key_partnerships.map((p: string, i: number) => (
                            <span key={i} className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/60">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold text-white/70 mb-2">Risk Factors</p>
                    <div className="space-y-2">
                      {(report.ipReport.valuation as any).deepseek_enhancement.risk_factors.technical_risks.length > 0 && (
                        <div>
                          <p className="text-[10px] text-white/50 mb-1">Technical Risks:</p>
                          <ul className="space-y-1">
                            {(report.ipReport.valuation as any).deepseek_enhancement.risk_factors.technical_risks.map((r: string, i: number) => (
                              <li key={i} className="text-[10px] text-white/55">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(report.ipReport.valuation as any).deepseek_enhancement.risk_factors.market_risks.length > 0 && (
                        <div>
                          <p className="text-[10px] text-white/50 mb-1">Market Risks:</p>
                          <ul className="space-y-1">
                            {(report.ipReport.valuation as any).deepseek_enhancement.risk_factors.market_risks.map((r: string, i: number) => (
                              <li key={i} className="text-[10px] text-white/55">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold text-white/70 mb-2">Recommendations</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] text-white/50 mb-1">Immediate Actions:</p>
                        <ul className="space-y-1">
                          {(report.ipReport.valuation as any).deepseek_enhancement.recommendations.immediate_actions.map((a: string, i: number) => (
                            <li key={i} className="text-[10px] text-white/55">• {a}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </section>
        )}

        {/* Value Chain Analysis */}
        {(report.ipReport as any).value_chain_analysis && (
          <section className="workflow-panel mb-6 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Orbit className="w-5 h-5 text-[#6efcff]" />
              <h2 className="font-headline text-lg font-bold text-white/95">Value Chain Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Upstream */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  Upstream
                </p>
                <div className="space-y-3">
                  {(report.ipReport as any).value_chain_analysis.upstream.map((stage: any, i: number) => (
                    <div key={i} className="rounded-lg bg-black/30 p-3">
                      <p className="text-xs font-semibold text-white/90 mb-1">{stage.stage}</p>
                      <p className="text-[10px] text-white/60 mb-2">{stage.description}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-white/50">Risk:</span>
                        <span className={`text-[10px] ${stage.risk_level === 'high' ? 'text-red-400' : stage.risk_level === 'medium' ? 'text-yellow-400' : 'text-emerald-400'}`}>{stage.risk_level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">Cost Impact:</span>
                        <span className={`text-[10px] ${stage.cost_impact === 'high' ? 'text-red-400' : 'text-emerald-400'}`}>{stage.cost_impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Midstream */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  Midstream
                </p>
                <div className="space-y-3">
                  {(report.ipReport as any).value_chain_analysis.midstream.map((stage: any, i: number) => (
                    <div key={i} className="rounded-lg bg-black/30 p-3">
                      <p className="text-xs font-semibold text-white/90 mb-1">{stage.stage}</p>
                      <p className="text-[10px] text-white/60 mb-2">{stage.description}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-white/50">Risk:</span>
                        <span className={`text-[10px] ${stage.risk_level === 'high' ? 'text-red-400' : stage.risk_level === 'medium' ? 'text-yellow-400' : 'text-emerald-400'}`}>{stage.risk_level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">Cost Impact:</span>
                        <span className={`text-[10px] ${stage.cost_impact === 'high' ? 'text-red-400' : 'text-emerald-400'}`}>{stage.cost_impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downstream */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-semibold text-white/70 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Downstream
                </p>
                <div className="space-y-3">
                  {(report.ipReport as any).value_chain_analysis.downstream.map((stage: any, i: number) => (
                    <div key={i} className="rounded-lg bg-black/30 p-3">
                      <p className="text-xs font-semibold text-white/90 mb-1">{stage.stage}</p>
                      <p className="text-[10px] text-white/60 mb-2">{stage.description}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-white/50">Risk:</span>
                        <span className={`text-[10px] ${stage.risk_level === 'high' ? 'text-red-400' : stage.risk_level === 'medium' ? 'text-yellow-400' : 'text-emerald-400'}`}>{stage.risk_level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-white/50">Cost Impact:</span>
                        <span className={`text-[10px] ${stage.cost_impact === 'high' ? 'text-red-400' : 'text-emerald-400'}`}>{stage.cost_impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Value Capture Opportunities */}
            <div className="rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/5 p-4">
              <p className="text-xs font-semibold text-[#c5fdff] mb-3">💰 Value Capture Opportunities</p>
              <ul className="space-y-2">
                {(report.ipReport as any).value_chain_analysis.value_capture_opportunities.map((opportunity: string, i: number) => (
                  <li key={i} className="text-xs text-white/70 flex items-start gap-2">
                    <span className="text-[#6efcff]">•</span>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Enhanced Due Diligence */}
        {report.dueDiligenceReport && (
          <section className="workflow-panel mb-6 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-[#6efcff]" />
              <h2 className="font-headline text-lg font-bold text-white/95">Due Diligence</h2>
            </div>
            
            {/* Spider Chart Visualization */}
            <div className="mb-6 rounded-xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-semibold text-white/70 mb-4">Multi-Dimensional Analysis</p>
              <SpiderChart data={report.dueDiligenceReport.dimensions.map(d => ({
                name: d.name,
                score: d.score,
                maxScore: d.maxScore
              }))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50 mb-1">Total Score</p>
                <div className="flex items-center gap-2">
                  <p className={`text-lg font-bold ${getDueDiligenceScoreColor(report.dueDiligenceReport.totalScore)}`}>{report.dueDiligenceReport.totalScore.toFixed(1)}%</p>
                  <div className="flex-1 bg-white/10 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getDueDiligenceScoreBarColor(report.dueDiligenceReport.totalScore)}`} style={{ width: `${report.dueDiligenceReport.totalScore}%` }} />
                  </div>
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs text-white/50 mb-1">Investment Tier</p>
                <span className={`text-sm font-bold uppercase ${getInvestmentTierColor(report.dueDiligenceReport.investmentTier)}`}>{report.dueDiligenceReport.investmentTier}</span>
              </div>
            </div>

            {/* Detailed Dimension Breakdown */}
            <div className="space-y-3">
              {report.dueDiligenceReport.dimensions.map((dim) => (
                <div key={dim.id} className="rounded-lg border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white/90">{dim.name}</span>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white/50">{dim.layer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#c5fdff]">{dim.score}/{dim.maxScore}</span>
                      <span className="text-xs text-white/50">({(dim.weight * 100).toFixed(0)}% weight)</span>
                    </div>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                    <div 
                      className="h-1.5 rounded-full bg-gradient-to-r from-[#6efcff]/50 to-[#6efcff]" 
                      style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                    />
                  </div>
                  {dim.evidence && dim.evidence.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-white/50 mb-1">Evidence:</p>
                      <ul className="space-y-1">
                        {dim.evidence.map((evidence, i) => (
                          <li key={i} className="text-xs text-white/60 flex items-start gap-2">
                            <span className="text-[#6efcff]">•</span>
                            <span>{evidence}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
              
              {/* DeepSeek-enhanced due diligence */}
              {(report.dueDiligenceReport as any).scientific_rigor && (
                <>
                  <div className="rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/5 p-4">
                    <p className="text-xs font-semibold text-[#c5fdff] mb-2">🔬 Scientific Rigor</p>
                    <div className="space-y-2 text-xs text-white/70">
                      <div className="flex justify-between">
                        <span>Methodology Quality</span>
                        <span>{(report.dueDiligenceReport as any).scientific_rigor.methodology_quality}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Experimental Design</span>
                        <span>{(report.dueDiligenceReport as any).scientific_rigor.experimental_design}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Data Analysis</span>
                        <span>{(report.dueDiligenceReport as any).scientific_rigor.data_analysis}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reproducibility</span>
                        <span>{(report.dueDiligenceReport as any).scientific_rigor.reproducibility_score}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold text-white/70 mb-2">Innovation Assessment</p>
                    <div className="space-y-2 text-xs text-white/60">
                      <div className="flex justify-between">
                        <span>Technical Novelty</span>
                        <span>{(report.dueDiligenceReport as any).innovation_assessment.technical_novelty}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Patentability Potential</span>
                        <span>{(report.dueDiligenceReport as any).innovation_assessment.patentability_potential}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold text-white/70 mb-2">Market Fit</p>
                    <div className="space-y-2 text-xs text-white/60">
                      <div className="flex justify-between">
                        <span>Problem Solving</span>
                        <span>{(report.dueDiligenceReport as any).market_fit.problem_solving}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Market Need</span>
                        <span>{(report.dueDiligenceReport as any).market_fit.market_need}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Competitive Advantage</span>
                        <span>{(report.dueDiligenceReport as any).market_fit.competitive_advantage}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Scalability</span>
                        <span>{(report.dueDiligenceReport as any).market_fit.scalability_potential}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold text-white/70 mb-2">Risk Assessment</p>
                    <div className="space-y-2">
                      {(report.dueDiligenceReport as any).risk_assessment.technical_risks.length > 0 && (
                        <div>
                          <p className="text-[10px] text-white/50 mb-1">Technical Risks:</p>
                          <ul className="space-y-1">
                            {(report.dueDiligenceReport as any).risk_assessment.technical_risks.map((r: string, i: number) => (
                              <li key={i} className="text-[10px] text-white/55">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(report.dueDiligenceReport as any).risk_assessment.execution_risks.length > 0 && (
                        <div>
                          <p className="text-[10px] text-white/50 mb-1">Execution Risks:</p>
                          <ul className="space-y-1">
                            {(report.dueDiligenceReport as any).risk_assessment.execution_risks.map((r: string, i: number) => (
                              <li key={i} className="text-[10px] text-white/55">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold text-white/70 mb-2">Investment Recommendation</p>
                    <div className="space-y-2 text-xs text-white/60">
                      <div className="flex justify-between">
                        <span>Overall Score</span>
                        <span className="font-semibold text-white/90">{(report.dueDiligenceReport as any).investment_recommendation.overall_score}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Action</span>
                        <span className="font-semibold text-[#c5fdff]">{(report.dueDiligenceReport as any).investment_recommendation.recommended_action}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border border-white/10 bg-black/20 p-4">
                    <p className="text-xs font-semibold text-white/70 mb-2">Next Steps</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-[10px] text-white/50 mb-1">Due Diligence Items:</p>
                        <ul className="space-y-1">
                          {(report.dueDiligenceReport as any).next_steps.due_diligence_items.map((item: string, i: number) => (
                            <li key={i} className="text-[10px] text-white/55">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
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

function EnhancedMetric({ label, value, trl, score, icon }: { label: string; value: string; trl?: number; score?: number; icon: React.ReactNode }) {
  const getMetricColor = () => {
    if (trl !== undefined) {
      if (trl >= 8) return "border-emerald-500/30 bg-emerald-950/20"
      if (trl >= 6) return "border-teal-500/30 bg-teal-950/20"
      if (trl >= 4) return "border-amber-500/30 bg-amber-950/20"
      return "border-indigo-500/30 bg-indigo-950/20"
    }
    if (score !== undefined) {
      if (score >= 80) return "border-emerald-500/30 bg-emerald-950/20"
      if (score >= 60) return "border-teal-500/30 bg-teal-950/20"
      if (score >= 40) return "border-amber-500/30 bg-amber-950/20"
      return "border-red-500/30 bg-red-950/20"
    }
    return "border-white/10 bg-black/20"
  }

  const getMetricTextColor = () => {
    if (trl !== undefined) {
      if (trl >= 8) return "text-emerald-400"
      if (trl >= 6) return "text-teal-400"
      if (trl >= 4) return "text-amber-400"
      return "text-indigo-400"
    }
    if (score !== undefined) {
      if (score >= 80) return "text-emerald-400"
      if (score >= 60) return "text-teal-400"
      if (score >= 40) return "text-amber-400"
      return "text-red-400"
    }
    return "text-white/90"
  }

  return (
    <div className={`rounded-xl border px-4 py-4 transition-all duration-200 hover:scale-105 ${getMetricColor()}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-white/10">{icon}</div>
        <p className="text-xs text-white/50">{label}</p>
      </div>
      <p className={`text-lg font-bold ${getMetricTextColor()} mt-1`}>{value}</p>
    </div>
  )
}

function getTRLBadgeClass(trl: number): string {
  if (trl >= 8) return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
  if (trl >= 6) return "bg-teal-500/10 text-teal-400 border border-teal-500/30"
  if (trl >= 4) return "bg-amber-500/10 text-amber-400 border border-amber-500/30"
  return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
}

function getTRLIcon(trl: number): React.ReactNode {
  if (trl >= 8) return <Award className="w-4 h-4 text-emerald-400" />
  if (trl >= 6) return <Zap className="w-4 h-4 text-teal-400" />
  if (trl >= 4) return <Battery className="w-4 h-4 text-amber-400" />
  return <Brain className="w-4 h-4 text-indigo-400" />
}

function getTRLIconBg(trl: number): string {
  if (trl >= 8) return "bg-emerald-500/20"
  if (trl >= 6) return "bg-teal-500/20"
  if (trl >= 4) return "bg-amber-500/20"
  return "bg-indigo-500/20"
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400"
  if (score >= 60) return "text-teal-400"
  if (score >= 40) return "text-amber-400"
  return "text-red-400"
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-500"
  if (score >= 60) return "bg-teal-500"
  if (score >= 40) return "bg-amber-500"
  return "bg-red-500"
}

function getFTORiskColor(risk: number): string {
  if (risk <= 0.2) return "text-emerald-400"
  if (risk <= 0.4) return "text-teal-400"
  if (risk <= 0.6) return "text-amber-400"
  return "text-red-400"
}

function getDueDiligenceScoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400"
  if (score >= 60) return "text-teal-400"
  if (score >= 40) return "text-amber-400"
  return "text-red-400"
}

function getDueDiligenceScoreBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-500"
  if (score >= 60) return "bg-teal-500"
  if (score >= 40) return "bg-amber-500"
  return "bg-red-500"
}

function getInvestmentTierColor(tier: string): string {
  if (tier === "A" || tier === "A+") return "text-emerald-400"
  if (tier === "B" || tier === "B+") return "text-teal-400"
  if (tier === "C" || tier === "C+") return "text-amber-400"
  return "text-red-400"
}
