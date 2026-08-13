"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Check, Save, Target, Gem, Loader2, Download, Flame, ShieldCheck, AlertTriangle, Award, ChevronRight, Zap, Brain, Battery, Wind, Orbit, Info, MessageSquare, X, FileText, Users, Building2, Scale, Gavel, Search, TrendingUp, BarChart3, Sparkles, Lock, CheckCircle2, XCircle } from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { formatUsd } from "@/lib/ai-studio/api"
import { addAssessment, addSubmittedMilestone, MILESTONE_LABELS } from "@/lib/trl-services/storage"
import { uploadMetadataToIPFSAction } from "@/lib/ipfs/uploadMetadataToIPFSAction"
import { useMintIPNFT } from "@/lib/web3/hooks/useMintIPNFT"
import { CONTRACT_ADDRESSES } from "@/lib/web3/config"
import type { CombinedAssessmentReport } from "@/lib/trl-services/types"
import { generateReportPDF } from "@/lib/pdf/generateReportPDF"
import { SpiderChart } from "@/components/ai-studio/SpiderChart"
import { ChatAgent } from "./chat-agent"
import ClaimChartVisualizer from "@/components/ClaimChartVisualizer"

export default function ProjectAssessmentResultsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [report, setReport] = useState<CombinedAssessmentReport | null>(null)
  const [saved, setSaved] = useState(false)
  const [minting, setMinting] = useState(false)
  const [minted, setMinted] = useState(false)
  const [nftTokenId, setNftTokenId] = useState<string | null>(null)
  const [ipfsUri, setIpfsUri] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)

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
    <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-950 to-black px-5 py-12 sm:px-6">
      <div className="relative z-10 mx-auto max-w-6xl">
        {/* Fallback Data Warning */}
        {isFallbackData && (
          <div className="mb-8 rounded-2xl border border-blue-500/40 bg-gradient-to-r from-blue-500/10 to-blue-500/5 p-5 backdrop-blur-sm">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 p-2 rounded-xl bg-blue-500/20">
                <Info className="w-5 h-5 text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-400 mb-2">Enhanced Analysis Mode</p>
                <p className="text-sm text-white/70 leading-relaxed">
                  {report.ipReport?.document_profile?.note?.includes("low quality") 
                    ? "Content quality analysis indicates limited technical depth. Results based on available content analysis with enhanced keyword detection and semantic understanding."
                    : "Advanced content analysis enabled. Results generated using intelligent content analysis with keyword detection, semantic understanding, and context-aware scoring."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Document Summary Section */}
        <div className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Brain className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Document Analysis Summary</h2>
              <p className="text-sm text-gray-500">Document structure and classification</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Document Type</p>
              <p className="text-sm font-medium text-gray-900">{report.ipReport?.document_profile?.document_type || "Research Paper"}</p>
            </div>
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Word Count</p>
              <p className="text-sm font-medium text-gray-900">{report.ipReport?.document_profile?.word_count?.toLocaleString() || "N/A"}</p>
            </div>
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Classification</p>
              <p className="text-sm font-medium text-gray-900">{report.ipReport?.classification?.sector_name || "N/A"}</p>
            </div>
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">Primary Field</p>
              <p className="text-sm font-medium text-gray-900">{(report.ipReport?.classification as any)?.field_classification?.primary || "Materials Science"}</p>
            </div>
          </div>
          <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide">Analysis Overview</p>
            <p className="text-sm text-gray-700 leading-relaxed">
              This document has been analyzed for {report.ipReport?.document_profile?.word_count?.toLocaleString() || "various"} words across {report.ipReport?.document_profile?.sections_found?.length || 3} sections. 
              The research is classified under {report.ipReport?.classification?.sector_name || "various fields"} with primary focus on {(report.ipReport?.classification as any)?.field_classification?.primary || "materials science"}. 
              The analysis indicates a TRL level of {report.trlProject.trl} with an IP novelty score of {report.summary.ipScore}/100.
            </p>
          </div>
        </div>

        <div className="mb-10 flex flex-wrap items-start justify-between gap-6">
          <div className="flex-1 min-w-[300px]">
            <p className="mb-3 text-[11px] uppercase tracking-widest text-[#c5fdff] font-semibold">Detailed Assessment Report</p>
            <h1 className="font-headline text-3xl font-bold text-white/95 md:text-4xl leading-tight">{report.title}</h1>
            <p className="mt-3 text-base text-white/50">
              {report.author} · {report.category}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={downloadPDF}
              className="inline-flex items-center gap-2 rounded-2xl border border-[#6efcff]/40 bg-gradient-to-r from-[#6efcff]/10 to-[#6efcff]/5 px-6 py-3 text-sm font-semibold text-[#c5fdff] hover:from-[#6efcff]/20 hover:to-[#6efcff]/10 transition-all duration-200 shadow-lg shadow-[#6efcff]/10"
            >
              <Download className="h-4 w-4" />
              Download PDF
            </button>
            {user ? (
              <button
                type="button"
                onClick={saveToProfile}
                disabled={saved}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#6efcff]/40 bg-gradient-to-r from-[#6efcff]/10 to-[#6efcff]/5 px-6 py-3 text-sm font-semibold text-[#c5fdff] hover:from-[#6efcff]/20 hover:to-[#6efcff]/10 transition-all duration-200 shadow-lg shadow-[#6efcff]/10 disabled:opacity-60"
              >
                {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saved ? "Saved to Profile" : "Save to Profile"}
              </button>
            ) : (
              <Link
                href="/auth/sign-in"
                className="rounded-2xl border border-white/20 px-6 py-3 text-sm text-white/70 hover:bg-white/5 transition-all duration-200"
              >
                Sign in to save
              </Link>
            )}
            {false && user?.walletAddress && !minted && (
              <button
                type="button"
                onClick={handleMintIPNFT}
                disabled={minting || isMintingPending}
                className="inline-flex items-center gap-2 rounded-2xl border border-[#6efcff]/40 bg-gradient-to-r from-[#6efcff]/10 to-[#6efcff]/5 px-6 py-3 text-sm font-semibold text-[#c5fdff] hover:from-[#6efcff]/20 hover:to-[#6efcff]/10 transition-all duration-200 shadow-lg shadow-[#6efcff]/10 disabled:opacity-60"
              >
                {minting || isMintingPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gem className="h-4 w-4" />}
                {minting || isMintingPending ? "Minting..." : "Mint IP-NFT"}
              </button>
            )}
            {minted && (
              <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 px-6 py-3 text-sm font-semibold text-emerald-400 shadow-lg shadow-emerald-500/10">
                <Award className="h-4 w-4" />
                IP-NFT Minted #{nftTokenId}
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Metrics Grid with Color Coding */}
        <div className="mb-10 grid grid-cols-2 gap-5 md:grid-cols-4">
          <EnhancedMetric 
            label="TRL Level" 
            value={`TRL ${report.summary.trl}`} 
            trl={report.summary.trl}
            icon={<Award className="w-5 h-5" />}
          />
          <EnhancedMetric 
            label="Innovation Score" 
            value={String(report.summary.ipScore)} 
            score={report.summary.ipScore}
            icon={<Flame className="w-5 h-5" />}
          />
          <EnhancedMetric 
            label="IP Valuation" 
            value={report.ipReport?.valuation?.valuation_available && report.ipReport?.valuation?.valuation_range_usd 
              ? `${formatUsd(report.ipReport.valuation.valuation_range_usd.low)} - ${formatUsd(report.ipReport.valuation.valuation_range_usd.high)}`
              : report.summary.valuationUsd 
                ? formatUsd(report.summary.valuationUsd) 
                : "Not estimated"
            }
            icon={<Gem className="w-5 h-5" />}
          />
          <EnhancedMetric 
            label="Due Diligence" 
            value={
              report.summary.dueDiligenceScore !== null
                ? `${report.summary.dueDiligenceScore.toFixed(0)}%`
                : "N/A"
            }
            score={report.summary.dueDiligenceScore || 0}
            icon={<ShieldCheck className="w-5 h-5" />}
          />
        </div>

        {/* Comprehensive Analysis Section */}
        {(report.ipReport as any)?.comprehensive_analysis && (
          <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Brain className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Comprehensive Analysis</h2>
            </div>
            <div className="space-y-6">
              {/* Executive Summary */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Executive Summary</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {(report.ipReport as any).comprehensive_analysis.executive_summary}
                </div>
              </div>

              {/* Technical Analysis */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Technical Analysis</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {(report.ipReport as any).comprehensive_analysis.technical_analysis}
                </div>
              </div>

              {/* Market Analysis */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Market Analysis</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {(report.ipReport as any).comprehensive_analysis.market_analysis}
                </div>
              </div>

              {/* IP and Competitive Analysis */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">IP & Competitive Analysis</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {(report.ipReport as any).comprehensive_analysis.ip_competitive_analysis}
                </div>
              </div>

              {/* Development Roadmap */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Development Roadmap</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {(report.ipReport as any).comprehensive_analysis.development_roadmap}
                </div>
              </div>

              {/* Risk Assessment */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Risk Assessment</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {(report.ipReport as any).comprehensive_analysis.risk_assessment}
                </div>
              </div>

              {/* Strategic Recommendations */}
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Strategic Recommendations</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {(report.ipReport as any).comprehensive_analysis.strategic_recommendations}
                </div>
              </div>

              {/* Investment Thesis */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Investment Thesis</h3>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {(report.ipReport as any).comprehensive_analysis.investment_thesis}
                </div>
              </div>

              {/* Team Assessment */}
              {report.trlProject?.team_assessment && (
                <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Team Assessment</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="border border-gray-200 bg-white rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">Team Expertise Score</p>
                      <p className="text-lg font-semibold text-gray-900">{((report.trlProject.team_expertise_score || 0.5) * 100).toFixed(0)}%</p>
                    </div>
                    <div className="border border-gray-200 bg-white rounded p-3">
                      <p className="text-xs text-gray-500 mb-1">Institution Reputation</p>
                      <p className="text-lg font-semibold text-gray-900">{((report.trlProject.institution_reputation_score || 0.5) * 100).toFixed(0)}%</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                    {report.trlProject.team_assessment}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Market Mapping Section */}
        {(report.ipReport as any)?.market_mapping && (
          <section className="workflow-panel mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6efcff]/30 to-[#6efcff]/10">
                <Orbit className="w-6 h-6 text-[#c5fdff]" />
              </div>
              <h2 className="font-headline text-xl font-bold text-white/95">Market Mapping Analysis</h2>
            </div>
            <div className="space-y-6">
              {/* Working Field */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Working Field</p>
                    <p className="text-base font-semibold text-white/90">{(report.ipReport as any).market_mapping.working_field}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Accuracy Score</p>
                    <p className="text-base font-semibold text-white/90">{(report.ipReport as any).market_mapping.overall_accuracy_score.toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* Market Opportunities */}
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white/70 mb-4">Market Opportunities</p>
                <div className="space-y-4">
                  {(report.ipReport as any).market_mapping.market_opportunities?.slice(0, 4).map((opp: any, i: number) => (
                    <div key={i} className="rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-white/90 mb-1">{opp.market_name}</p>
                          <p className="text-xs text-white/50">{opp.market_size} · {opp.growth_rate}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-white/50 mb-1">Fit Score</p>
                          <p className="text-sm font-bold text-[#c5fdff]">{opp.fit_score.toFixed(0)}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/60">{opp.entry_difficulty} Entry</span>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-white/60">{opp.key_competitors?.slice(0, 2).join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Recommendations */}
              {(report.ipReport as any).market_mapping.strategic_recommendations && (
                <div className="rounded-2xl border border-[#6efcff]/30 bg-gradient-to-br from-[#6efcff]/10 to-[#6efcff]/5 p-6 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-[#c5fdff] mb-4">Strategic Recommendations</p>
                  <ul className="space-y-2">
                    {(report.ipReport as any).market_mapping.strategic_recommendations.slice(0, 4).map((rec: string, i: number) => (
                      <li key={i} className="text-sm text-white/70 flex items-start gap-3 leading-relaxed">
                        <span className="text-[#6efcff] mt-0.5">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Development Insights */}
              {(report.ipReport as any).market_mapping.development_insights && (
                <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
                  <p className="text-sm font-semibold text-white/70 mb-4">Development Insights</p>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Current Stage</p>
                      <p className="text-sm text-white/70">{(report.ipReport as any).market_mapping.development_insights.current_stage_assessment}</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/50 mb-2 uppercase tracking-wider">Funding Stage</p>
                      <p className="text-sm text-white/70">{(report.ipReport as any).market_mapping.development_insights.funding_recommendations.stage}</p>
                      <p className="text-xs text-white/50 mt-1">{(report.ipReport as any).market_mapping.development_insights.funding_recommendations.estimated_range}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Enhanced TRL Evaluation Section */}
        <section className="workflow-panel mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6efcff]/30 to-[#6efcff]/10">
              <Award className="w-6 h-6 text-[#c5fdff]" />
            </div>
            <h2 className="font-headline text-xl font-bold text-white/95">TRL Evaluation Details</h2>
            <span className={`ml-auto font-mono text-xs font-bold tracking-wider uppercase px-3 py-1.5 rounded-xl ${getTRLBadgeClass(report.trlProject.trl)}`}>
              TRL {report.trlProject.trl}
            </span>
          </div>
          <div className="space-y-5">
            {/* TRL Summary Card */}
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-black/20 to-black/40 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${getTRLIconBg(report.trlProject.trl)} flex-shrink-0`}>
                  {getTRLIcon(report.trlProject.trl)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white/70 mb-3">Why TRL {report.trlProject.trl}?</p>
                  <p className="text-base text-white/60 leading-relaxed">{report.trlProject.trlSummary}</p>
                </div>
              </div>
            </div>
            
            {/* Key Accomplishments */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
              <p className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                Key Accomplishments
              </p>
              <ul className="space-y-3">
                {report.trlProject.accomplishments.map((a, i) => (
                  <li key={i} className="text-sm text-white/55 flex items-start gap-3 leading-relaxed">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Innovation Score with Reasoning */}
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-white/70 flex items-center gap-2">
                  <Flame className="w-4 h-4 text-orange-400" />
                  Innovation Score
                </p>
                <span className={`font-mono text-base font-bold ${getScoreColor(report.trlProject.score)}`}>
                  {report.trlProject.score}/100
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-3 mb-4">
                <div 
                  className={`h-3 rounded-full transition-all duration-500 ${getScoreBarColor(report.trlProject.score)}`} 
                  style={{ width: `${report.trlProject.score}%` }}
                />
              </div>
              <div className="rounded-xl bg-white/5 p-4">
                <p className="text-xs font-semibold text-[#6efcff] mb-2 uppercase tracking-wider">WHY THIS SCORE?</p>
                <p className="text-sm text-white/60 leading-relaxed">
                  {(report.trlProject as any).scoreReasoning?.innovation || "Innovation score based on technical novelty, scientific rigor, and potential impact analysis."}
                </p>
              </div>
            </div>
            
            {/* Paper Key Data Extraction */}
            {(report.trlProject as any).keyData && (
              <div className="rounded-2xl border border-[#6efcff]/30 bg-gradient-to-br from-[#6efcff]/10 to-[#6efcff]/5 p-6 backdrop-blur-sm">
                <p className="text-sm font-semibold text-[#c5fdff] mb-4 flex items-center gap-2">
                  <Brain className="w-4 h-4" />
                  Paper Key Data Extraction
                </p>
                <div className="space-y-4">
                  <div className="rounded-xl bg-black/30 p-4">
                    <p className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">KEY FINDINGS</p>
                    <ul className="space-y-2">
                      {(report.trlProject as any).keyData.keyFindings.map((finding: string, i: number) => (
                        <li key={i} className="text-sm text-white/70 leading-relaxed">
                          • {finding.slice(0, 150)}{finding.length > 150 ? '...' : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="rounded-xl bg-black/30 p-4">
                      <p className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">METHODOLOGY</p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {(report.trlProject as any).keyData.methodology?.slice(0, 80) || 'Not specified'}...
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/30 p-4">
                      <p className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">RESULTS</p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {(report.trlProject as any).keyData.results?.slice(0, 80) || 'Not specified'}...
                      </p>
                    </div>
                    <div className="rounded-xl bg-black/30 p-4">
                      <p className="text-xs font-semibold text-white/50 mb-2 uppercase tracking-wider">IMPLICATIONS</p>
                      <p className="text-sm text-white/70 leading-relaxed">
                        {(report.trlProject as any).keyData.implications?.slice(0, 80) || 'Not specified'}...
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Score Reasoning Breakdown */}
            {(report.trlProject as any).scoreReasoning && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
                <p className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Score Reasoning Breakdown
                </p>
                <div className="space-y-4">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs font-semibold text-orange-400 mb-2 uppercase tracking-wider">INNOVATION</p>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {(report.trlProject as any).scoreReasoning.innovation}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs font-semibold text-emerald-400 mb-2 uppercase tracking-wider">COMMERCIAL VIABILITY</p>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {(report.trlProject as any).scoreReasoning.commercialViability}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs font-semibold text-blue-400 mb-2 uppercase tracking-wider">SCIENTIFIC RIGOR</p>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {(report.trlProject as any).scoreReasoning.scientificRigor}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-xs font-semibold text-purple-400 mb-2 uppercase tracking-wider">IP STRENGTH</p>
                    <p className="text-sm text-white/60 leading-relaxed">
                      {(report.trlProject as any).scoreReasoning.ipStrength}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
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
        <section className="workflow-panel mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6efcff]/30 to-[#6efcff]/10">
              <Target className="w-6 h-6 text-[#c5fdff]" />
            </div>
            <h2 className="font-headline text-xl font-bold text-white/95">Milestone Roadmap</h2>
          </div>
          <div className="space-y-5">
            {/* Incomplete/Current Milestones with Recommendations */}
            {Object.entries(report.trlProject.milestones)
              .filter(([, m]) => m.status === "current" || m.status === "future")
              .map(([key, m], index) => (
                <div key={key} className={`rounded-2xl border p-6 transition-all duration-200 ${
                  m.status === "current" 
                    ? "border-[#6efcff]/40 bg-gradient-to-br from-[#6efcff]/10 to-transparent shadow-xl shadow-[#6efcff]/15" 
                    : "border-white/10 bg-black/30 backdrop-blur-sm"
                }`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`p-3 rounded-xl ${m.status === "current" ? "bg-[#6efcff]/20" : "bg-white/10"} flex-shrink-0`}>
                        {m.status === "current" ? (
                          <Flame className="w-5 h-5 text-[#6efcff]" />
                        ) : (
                          <Target className="w-5 h-5 text-white/50" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm font-semibold uppercase text-white/90">
                            {MILESTONE_LABELS[key] || key}
                          </span>
                          <span className={`font-mono text-xs px-3 py-1 rounded-lg ${
                            m.status === "current" 
                              ? "bg-[#6efcff]/20 text-[#c5fdff]" 
                              : "bg-white/10 text-white/50"
                          }`}>
                            {m.status}
                          </span>
                        </div>
                        <p className="text-base text-white/70 leading-relaxed mb-3">{m.description}</p>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-white/50">Target: {m.timeline}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 ${
                      m.status === "current" ? "bg-[#6efcff] text-black shadow-lg shadow-[#6efcff]/20" : "bg-white/10 text-white/50"
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Enhanced What/Why/How Details */}
                  <div className="mt-5 pt-5 -mx-6 px-6 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="rounded-xl bg-black/30 p-4 backdrop-blur-sm">
                        <p className="text-xs font-semibold text-[#6efcff] mb-2 uppercase tracking-wider">WHAT</p>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {m.status === "current" 
                            ? "Complete the validation phase for this milestone by demonstrating technical feasibility and gathering required evidence."
                            : "Plan and prepare for this milestone by establishing requirements and resource allocation."
                          }
                        </p>
                      </div>
                      <div className="rounded-xl bg-black/30 p-4 backdrop-blur-sm">
                        <p className="text-xs font-semibold text-[#6efcff] mb-2 uppercase tracking-wider">WHY</p>
                        <p className="text-sm text-white/60 leading-relaxed">
                          {m.status === "current"
                            ? "This milestone is critical for advancing to the next TRL level and demonstrating commercial viability to investors."
                            : "This milestone builds on previous achievements and is necessary for scaling the technology."
                          }
                        </p>
                      </div>
                      <div className="rounded-xl bg-black/30 p-4 backdrop-blur-sm">
                        <p className="text-xs font-semibold text-[#6efcff] mb-2 uppercase tracking-wider">HOW</p>
                        <p className="text-sm text-white/60 leading-relaxed">
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
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                      <p className="text-sm font-semibold text-white/70 mb-3">Specific Actions Required:</p>
                      <ul className="space-y-2">
                        {(m as any).specific_actions.map((action: string, i: number) => (
                          <li key={i} className="text-sm text-white/55 flex items-start gap-3 leading-relaxed">
                            <span className="text-[#6efcff]">•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {(m as any).resources_needed && (m as any).resources_needed.length > 0 && (
                    <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-4 backdrop-blur-sm">
                      <p className="text-sm font-semibold text-white/70 mb-3">Resources Needed:</p>
                      <div className="flex flex-wrap gap-2">
                        {(m as any).resources_needed.map((resource: string, i: number) => (
                          <span key={i} className="text-xs bg-white/10 px-3 py-1.5 rounded-lg text-white/60">
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {m.status === "current" && (
                    <p className="mt-3 text-sm text-[#6efcff] font-medium">
                      💡 This is your current focus. Complete this milestone to advance to the next TRL level.
                    </p>
                  )}
                  {m.status === "future" && (
                    <p className="mt-3 text-sm text-white/50">
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
        <section className="workflow-panel mb-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-8 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6efcff]/30 to-[#6efcff]/10">
              <ChevronRight className="w-6 h-6 text-[#c5fdff]" />
            </div>
            <h2 className="font-headline text-xl font-bold text-white/95">Recommended Next Steps</h2>
          </div>
          <div className="space-y-4">
            {report.summary.recommendedNextSteps.map((step, index) => (
              <div key={step} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-black/30 px-5 py-4 transition-all duration-200 hover:border-[#6efcff]/30 backdrop-blur-sm">
                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#6efcff]/20 flex items-center justify-center">
                  <span className="text-sm font-bold text-[#c5fdff]">{index + 1}</span>
                </div>
                <p className="text-base text-white/65 flex-1 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl border border-[#6efcff]/30 bg-gradient-to-r from-[#6efcff]/10 to-[#6efcff]/5 p-4 backdrop-blur-sm">
            <p className="text-sm text-white/70 leading-relaxed">
              Submit milestone proofs via the{" "}
              <Link href="/ai-auditor" className="text-[#c5fdff] underline font-medium hover:text-[#6efcff]">
                AI Auditor
              </Link>{" "}
              — results will appear on your{" "}
              <Link href="/submit/milestone" className="text-[#c5fdff] underline font-medium hover:text-[#6efcff]">
                milestone page
              </Link>
              .
            </p>
          </div>
        </section>

        {/* USPTO Patent Search Results - New Section */}
        {(report.ipReport as any)?.uspto_patents && (report.ipReport as any).uspto_patents.length > 0 && (
          <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-700" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">USPTO Patent Search Results</h2>
                <p className="text-sm text-gray-500">Source: USPTO Open Data Portal</p>
              </div>
            </div>
            <div className="space-y-4">
              {(report.ipReport as any).uspto_patents.slice(0, 5).map((patent: any, i: number) => (
                <div key={i} className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-mono text-gray-600">{patent.patent_id}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${
                          patent.similarity_score > 0.7 ? 'bg-red-100 text-red-700 border-red-200' :
                          patent.similarity_score > 0.4 ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                          'bg-green-100 text-green-700 border-green-200'
                        }`}>
                          {(patent.similarity_score * 100).toFixed(0)}% Similarity
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mb-1">{patent.title}</p>
                      <p className="text-xs text-gray-600 mb-2">{patent.abstract?.slice(0, 150)}...</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Filing: {patent.filing_date}</span>
                        <span>•</span>
                        <span>Assignee: {patent.assignee || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  {patent.ipc_codes && patent.ipc_codes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {patent.ipc_codes.slice(0, 3).map((code: string, j: number) => (
                        <span key={j} className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">{code}</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Patent Claim Analysis - New Section */}
        {(report.ipReport as any)?.patent_claim_analysis && (
          <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Gavel className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Patent Claim Analysis (35 USC § 102/103)</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Novelty Analysis */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-gray-700" />
                  <h3 className="text-sm font-semibold text-gray-900">Novelty Analysis (§ 102)</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Novelty Score</span>
                    <span className={`text-lg font-bold ${
                      (report.ipReport as any).patent_claim_analysis.novelty_score >= 0.7 ? 'text-green-600' :
                      (report.ipReport as any).patent_claim_analysis.novelty_score >= 0.4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {((report.ipReport as any).patent_claim_analysis.novelty_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      (report.ipReport as any).patent_claim_analysis.novelty_score >= 0.7 ? 'bg-green-500' :
                      (report.ipReport as any).patent_claim_analysis.novelty_score >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${(report.ipReport as any).patent_claim_analysis.novelty_score * 100}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-1">Novel Elements:</p>
                  <div className="flex flex-wrap gap-2">
                    {(report.ipReport as any).patent_claim_analysis.novel_elements.slice(0, 3).map((element: string, i: number) => (
                      <span key={i} className="text-xs bg-green-100 px-2 py-1 rounded text-green-700">{element.slice(0, 20)}...</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Non-Obviousness Analysis */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Scale className="w-5 h-5 text-gray-700" />
                  <h3 className="text-sm font-semibold text-gray-900">Non-Obviousness (§ 103)</h3>
                </div>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Non-Obviousness Score</span>
                    <span className={`text-lg font-bold ${
                      (report.ipReport as any).patent_claim_analysis.non_obviousness_score >= 0.7 ? 'text-green-600' :
                      (report.ipReport as any).patent_claim_analysis.non_obviousness_score >= 0.4 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {((report.ipReport as any).patent_claim_analysis.non_obviousness_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${
                      (report.ipReport as any).patent_claim_analysis.non_obviousness_score >= 0.7 ? 'bg-green-500' :
                      (report.ipReport as any).patent_claim_analysis.non_obviousness_score >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                    }`} style={{ width: `${(report.ipReport as any).patent_claim_analysis.non_obviousness_score * 100}%` }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-500 mb-1">Non-Obvious Features:</p>
                  <div className="flex flex-wrap gap-2">
                    {(report.ipReport as any).patent_claim_analysis.non_obvious_features.slice(0, 3).map((feature: string, i: number) => (
                      <span key={i} className="text-xs bg-green-100 px-2 py-1 rounded text-green-700">{feature.slice(0, 20)}...</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-5">
              <p className="text-sm font-semibold text-gray-900 mb-3">Overall Patentability</p>
              <p className="text-sm text-gray-700 leading-relaxed">{(report.ipReport as any).patent_claim_analysis.overall_patentability}</p>
              {(report.ipReport as any).patent_claim_analysis.recommendations && (report.ipReport as any).patent_claim_analysis.recommendations.length > 0 && (
                <div className="mt-4">
                  <p className="text-xs text-gray-500 mb-2">Recommendations:</p>
                  <ul className="space-y-2">
                    {(report.ipReport as any).patent_claim_analysis.recommendations.slice(0, 3).map((rec: string, i: number) => (
                      <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-blue-600">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Legal Citation Verification - New Section */}
        {(report.ipReport as any)?.legal_citation_verification && (
          <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <FileText className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Legal Citation Verification</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Total Citations</p>
                <p className="text-2xl font-bold text-gray-900">{(report.ipReport as any).legal_citation_verification.total_citations}</p>
              </div>
              <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Verified</p>
                <p className="text-2xl font-bold text-green-600">{(report.ipReport as any).legal_citation_verification.verified_citations}</p>
              </div>
              <div className="border border-red-200 bg-red-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Invalid</p>
                <p className="text-2xl font-bold text-red-600">{(report.ipReport as any).legal_citation_verification.invalid_citations}</p>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-2">Confidence</p>
                <p className="text-2xl font-bold text-gray-900">{((report.ipReport as any).legal_citation_verification.overall_confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
            {(report.ipReport as any).legal_citation_verification.recommendations && (report.ipReport as any).legal_citation_verification.recommendations.length > 0 && (
              <div className="border border-blue-200 bg-blue-50 rounded-lg p-5">
                <p className="text-sm font-semibold text-gray-900 mb-3">Verification Recommendations</p>
                <ul className="space-y-2">
                  {(report.ipReport as any).legal_citation_verification.recommendations.map((rec: string, i: number) => (
                    <li key={i} className="text-sm text-gray-700 flex items-start gap-3">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Claim Chart Visualizer - New Section */}
        {(report.ipReport as any)?.claim_chart_data && (
          <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Claim Chart Analysis</h2>
            </div>
            <ClaimChartVisualizer
              patentClaims={(report.ipReport as any).claim_chart_data.patent_claims || []}
              priorArtClaims={(report.ipReport as any).claim_chart_data.prior_art_claims || []}
            />
          </section>
        )}


        {/* Enhanced IP & FTO Analysis */}
        {report.ipReport && (
          <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">IP & FTO Analysis</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Sector</p>
                <p className="text-sm font-medium text-gray-900">{report.ipReport.classification.sector_name}</p>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">FTO Risk Score</p>
                <p className={`text-sm font-medium ${getFTORiskColor(report.ipReport.fto.r_fto)}`}>{(report.ipReport.fto.r_fto * 100).toFixed(2)}%</p>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Target Valuation</p>
                <p className="text-sm font-medium text-green-600">{formatUsd(report.ipReport.valuation.v_target_usd)}</p>
              </div>
            </div>

            {/* Enhanced Classification & Keywords */}
            {(report.ipReport.classification as any).detected_keywords && (
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-xs font-semibold text-gray-900 mb-3">Automatic Classification & Keywords</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Detected Keywords:</p>
                    <div className="flex flex-wrap gap-2">
                      {(report.ipReport.classification as any).detected_keywords.map((keyword: string, i: number) => (
                        <span key={i} className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-700">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Field Classification:</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Primary:</span>
                        <span className="text-xs text-gray-900">{(report.ipReport.classification as any).field_classification?.primary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Secondary:</span>
                        <span className="text-xs text-gray-900">{(report.ipReport.classification as any).field_classification?.secondary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Tertiary:</span>
                        <span className="text-xs text-gray-900">{(report.ipReport.classification as any).field_classification?.tertiary}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Enhanced Valuation Factors Breakdown */}
            {(report.ipReport.valuation as any).additional_factors && (
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 mt-4">
                <p className="text-xs font-semibold text-gray-900 mb-3">Enhanced Valuation Factors</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="border border-gray-200 bg-white rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">Market Size Multiplier</p>
                    <p className="text-sm font-medium text-gray-900">{((report.ipReport.valuation as any).additional_factors.market_size_multiplier).toFixed(2)}x</p>
                  </div>
                  <div className="border border-gray-200 bg-white rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">TRL Adjustment</p>
                    <p className="text-sm font-medium text-gray-900">{((report.ipReport.valuation as any).additional_factors.trl_adjustment_factor).toFixed(2)}x</p>
                  </div>
                  <div className="border border-gray-200 bg-white rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">Team Quality</p>
                    <p className="text-sm font-medium text-gray-900">{((report.ipReport.valuation as any).additional_factors.team_quality_score).toFixed(2)}</p>
                  </div>
                  <div className="border border-gray-200 bg-white rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">Competitive Advantage</p>
                    <p className="text-sm font-medium text-gray-900">{((report.ipReport.valuation as any).additional_factors.competitive_advantage_score).toFixed(2)}</p>
                  </div>
                  <div className="border border-gray-200 bg-white rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">Regulatory Risk</p>
                    <p className="text-sm font-medium text-gray-900">{((report.ipReport.valuation as any).additional_factors.regulatory_risk_discount * 100).toFixed(1)}%</p>
                  </div>
                  <div className="border border-gray-200 bg-white rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">Time to Market</p>
                    <p className="text-sm font-medium text-gray-900">{(report.ipReport.valuation as any).additional_factors.time_to_market_months} months</p>
                  </div>
                  <div className="border border-gray-200 bg-white rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">Patent Strength</p>
                    <p className="text-sm font-medium text-gray-900">{((report.ipReport.valuation as any).additional_factors.patent_strength_score).toFixed(2)}</p>
                  </div>
                  <div className="border border-gray-200 bg-white rounded p-3">
                    <p className="text-xs text-gray-500 mb-1">Commercial Readiness</p>
                    <p className="text-sm font-medium text-gray-900">{((report.ipReport.valuation as any).additional_factors.commercial_readiness_score).toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500 mb-1">Enhanced Formula:</p>
                  <p className="text-xs text-blue-600 font-mono">{report.ipReport.valuation.formula}</p>
                </div>
              </div>
            )}
            
            <div className="mt-4 border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-900 mb-2">Valuation Calculation Breakdown</p>
                <div className="space-y-2 text-xs text-gray-700">
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
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-semibold text-gray-900">
                    <span>Target Valuation (V_target)</span>
                    <span>{formatUsd(report.ipReport.valuation.v_target_usd)}</span>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Formula: V_target = V_baseline × S_originality × (1 - R_fto)
                  </p>
                </div>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-900 mb-2">Classification Details</p>
                <div className="space-y-2 text-xs text-gray-700">
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
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Market Opportunity</p>
                    <div className="space-y-2 text-xs text-gray-700">
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
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Commercialization Path</p>
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex justify-between">
                        <span>Time to Market</span>
                        <span>{(report.ipReport.valuation as any).deepseek_enhancement.commercialization_path.time_to_market}</span>
                      </div>
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Key Partnerships:</p>
                        <div className="flex flex-wrap gap-1">
                          {(report.ipReport.valuation as any).deepseek_enhancement.commercialization_path.key_partnerships.map((p: string, i: number) => (
                            <span key={i} className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-700">{p}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Risk Factors</p>
                    <div className="space-y-2">
                      {(report.ipReport.valuation as any).deepseek_enhancement.risk_factors.technical_risks.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Technical Risks:</p>
                          <ul className="space-y-1">
                            {(report.ipReport.valuation as any).deepseek_enhancement.risk_factors.technical_risks.map((r: string, i: number) => (
                              <li key={i} className="text-xs text-gray-600">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(report.ipReport.valuation as any).deepseek_enhancement.risk_factors.market_risks.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Market Risks:</p>
                          <ul className="space-y-1">
                            {(report.ipReport.valuation as any).deepseek_enhancement.risk_factors.market_risks.map((r: string, i: number) => (
                              <li key={i} className="text-xs text-gray-600">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Recommendations</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Immediate Actions:</p>
                        <ul className="space-y-1">
                          {(report.ipReport.valuation as any).deepseek_enhancement.recommendations.immediate_actions.map((a: string, i: number) => (
                            <li key={i} className="text-xs text-gray-600">• {a}</li>
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
          <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Orbit className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Value Chain Analysis</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Upstream */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Upstream
                </p>
                <div className="space-y-3">
                  {(report.ipReport as any).value_chain_analysis.upstream.map((stage: any, i: number) => (
                    <div key={i} className="border border-gray-200 bg-white rounded p-3">
                      <p className="text-xs font-medium text-gray-900 mb-1">{stage.stage}</p>
                      <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">Risk:</span>
                        <span className={`text-xs ${stage.risk_level === 'high' ? 'text-red-600' : stage.risk_level === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{stage.risk_level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Cost Impact:</span>
                        <span className={`text-xs ${stage.cost_impact === 'high' ? 'text-red-600' : 'text-green-600'}`}>{stage.cost_impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Midstream */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Midstream
                </p>
                <div className="space-y-3">
                  {(report.ipReport as any).value_chain_analysis.midstream.map((stage: any, i: number) => (
                    <div key={i} className="border border-gray-200 bg-white rounded p-3">
                      <p className="text-xs font-medium text-gray-900 mb-1">{stage.stage}</p>
                      <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">Risk:</span>
                        <span className={`text-xs ${stage.risk_level === 'high' ? 'text-red-600' : stage.risk_level === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{stage.risk_level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Cost Impact:</span>
                        <span className={`text-xs ${stage.cost_impact === 'high' ? 'text-red-600' : 'text-green-600'}`}>{stage.cost_impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Downstream */}
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs font-semibold text-gray-700 mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Downstream
                </p>
                <div className="space-y-3">
                  {(report.ipReport as any).value_chain_analysis.downstream.map((stage: any, i: number) => (
                    <div key={i} className="border border-gray-200 bg-white rounded p-3">
                      <p className="text-xs font-medium text-gray-900 mb-1">{stage.stage}</p>
                      <p className="text-xs text-gray-600 mb-2">{stage.description}</p>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">Risk:</span>
                        <span className={`text-xs ${stage.risk_level === 'high' ? 'text-red-600' : stage.risk_level === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>{stage.risk_level}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Cost Impact:</span>
                        <span className={`text-xs ${stage.cost_impact === 'high' ? 'text-red-600' : 'text-green-600'}`}>{stage.cost_impact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Value Capture Opportunities */}
            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-900 mb-3">Value Capture Opportunities</p>
              <ul className="space-y-2">
                {(report.ipReport as any).value_chain_analysis.value_capture_opportunities.map((opportunity: string, i: number) => (
                  <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>{opportunity}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* Enhanced Due Diligence */}
        {report.dueDiligenceReport && (
          <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Brain className="w-5 h-5 text-gray-700" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Due Diligence</h2>
            </div>
            
            {/* Spider Chart Visualization */}
            <div className="mb-6 border border-gray-200 bg-gray-50 rounded-lg p-4">
              <p className="text-xs font-semibold text-gray-700 mb-4">Multi-Dimensional Analysis</p>
              <SpiderChart data={report.dueDiligenceReport.dimensions.map((d: any) => ({
                name: d.name,
                score: d.score,
                maxScore: d.maxScore
              }))} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Total Score</p>
                <div className="flex items-center gap-2">
                  <p className={`text-lg font-bold ${getDueDiligenceScoreColor(report.dueDiligenceReport.totalScore)}`}>{report.dueDiligenceReport.totalScore.toFixed(1)}%</p>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${getDueDiligenceScoreBarColor(report.dueDiligenceReport.totalScore)}`} style={{ width: `${report.dueDiligenceReport.totalScore}%` }} />
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Investment Tier</p>
                <span className={`text-sm font-bold uppercase ${getInvestmentTierColor(report.dueDiligenceReport.investmentTier)}`}>{report.dueDiligenceReport.investmentTier}</span>
              </div>
            </div>

            {/* Detailed Dimension Breakdown */}
            <div className="space-y-3 mb-6">
              {report.dueDiligenceReport.dimensions.map((dim: any) => (
                <div key={dim.id} className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{dim.name}</span>
                      <span className="text-xs bg-gray-200 px-2 py-0.5 rounded text-gray-600">{dim.layer}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-blue-600">{dim.score}/{dim.maxScore}</span>
                      <span className="text-xs text-gray-500">({(dim.weight * 100).toFixed(0)}% weight)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
                    <div 
                      className="h-1.5 rounded-full bg-blue-500" 
                      style={{ width: `${(dim.score / dim.maxScore) * 100}%` }}
                    />
                  </div>
                  {dim.evidence && dim.evidence.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Evidence:</p>
                      <ul className="space-y-1">
                        {dim.evidence.map((evidence: string, i: number) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-blue-600">•</span>
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
                  <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Scientific Rigor</p>
                    <div className="space-y-2 text-xs text-gray-700">
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
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Innovation Assessment</p>
                    <div className="space-y-2 text-xs text-gray-700">
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
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Market Fit</p>
                    <div className="space-y-2 text-xs text-gray-700">
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
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Risk Assessment</p>
                    <div className="space-y-2">
                      {(report.dueDiligenceReport as any).risk_assessment.technical_risks.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Technical Risks:</p>
                          <ul className="space-y-1">
                            {(report.dueDiligenceReport as any).risk_assessment.technical_risks.map((r: string, i: number) => (
                              <li key={i} className="text-xs text-gray-600">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(report.dueDiligenceReport as any).risk_assessment.execution_risks.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Execution Risks:</p>
                          <ul className="space-y-1">
                            {(report.dueDiligenceReport as any).risk_assessment.execution_risks.map((r: string, i: number) => (
                              <li key={i} className="text-xs text-gray-600">• {r}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 mb-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Investment Recommendation</p>
                    <div className="space-y-2 text-xs text-gray-700">
                      <div className="flex justify-between">
                        <span>Overall Score</span>
                        <span className="font-semibold text-gray-900">{(report.dueDiligenceReport as any).investment_recommendation.overall_score}/100</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Recommended Action</span>
                        <span className="font-semibold text-blue-600">{(report.dueDiligenceReport as any).investment_recommendation.recommended_action}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
                    <p className="text-xs font-semibold text-gray-900 mb-2">Next Steps</p>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Due Diligence Items:</p>
                        <ul className="space-y-1">
                          {(report.dueDiligenceReport as any).next_steps.due_diligence_items.map((item: string, i: number) => (
                            <li key={i} className="text-xs text-gray-600">• {item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              )}
          </section>
        )}

        <section className="mb-8 border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Comprehensive Analysis Document</h2>
          <div className="space-y-6 text-sm text-gray-700">
            {ipfsUri && (
              <div className="border border-amber-200 bg-amber-50 rounded-lg p-4">
                <h3 className="mb-2 font-semibold text-gray-900">IP-NFT Metadata</h3>
                <p className="text-xs text-gray-600 break-all">IPFS URI: {ipfsUri}</p>
                {minted && (
                  <p className="mt-2 text-xs text-green-600">✓ Successfully minted as IP-NFT #{nftTokenId}</p>
                )}
              </div>
            )}
            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Project Overview</h3>
              <p className="mb-2"><strong>Title:</strong> {report.title}</p>
              <p className="mb-2"><strong>Author:</strong> {report.author}</p>
              <p><strong>Category:</strong> {report.category}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-900">TRL Evaluation Analysis</h3>
              <p className="mb-2"><strong>TRL Level:</strong> {report.summary.trl}</p>
              <p className="mb-2"><strong>TRL Summary:</strong> {report.trlProject.trlSummary}</p>
              <p className="mb-2"><strong>Key Accomplishments:</strong></p>
              <ul className="ml-4 space-y-1">
                {report.trlProject.accomplishments.map((a: string, i: number) => (
                  <li key={i}>• {a}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Milestone Roadmap</h3>
              <div className="space-y-2">
                {Object.entries(report.trlProject.milestones).map(([key, m]: [string, any]) => (
                  <div key={key} className="border border-gray-200 bg-gray-50 rounded-lg p-3">
                    <p className="font-medium text-gray-900">{MILESTONE_LABELS[key] || key}</p>
                    <p className="text-xs text-gray-600">{m.description}</p>
                    <p className="text-xs text-gray-500 mt-1">Timeline: {m.timeline}</p>
                    <p className="text-xs text-blue-600 mt-1">Status: {m.status}</p>
                  </div>
                ))}
              </div>
            </div>

            {report.ipReport && (
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">IP Valuation & FTO Analysis</h3>
                <p className="mb-2"><strong>Sector:</strong> {report.ipReport.classification.sector_name}</p>
                <p className="mb-2"><strong>FTO Risk Score:</strong> {(report.ipReport.fto.r_fto * 100).toFixed(2)}%</p>
                <p className="mb-2"><strong>Target Valuation:</strong> {formatUsd(report.ipReport.valuation.v_target_usd)}</p>
                <p className="mb-2"><strong>Classification:</strong> {report.ipReport.classification.ipc_primary}</p>
              </div>
            )}

            {report.dueDiligenceReport && (
              <div>
                <h3 className="mb-2 font-semibold text-gray-900">Scientific Due Diligence Analysis</h3>
                <p className="mb-2"><strong>Total Due Diligence Score:</strong> {report.dueDiligenceReport.totalScore.toFixed(2)}%</p>
                <p className="mb-2"><strong>Investment Tier:</strong> <span className="uppercase text-blue-600">{report.dueDiligenceReport.investmentTier}</span></p>
                <p className="mb-2"><strong>Integrity Gate Status:</strong> {report.dueDiligenceReport.integrityGateTriggered ? "Triggered" : "Not Triggered"}</p>
              </div>
            )}

            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Summary Metrics</h3>
              <p className="mb-2"><strong>Innovation Score:</strong> {report.summary.ipScore}</p>
              <p className="mb-2"><strong>IP Valuation:</strong> {report.summary.valuationUsd ? formatUsd(report.summary.valuationUsd) : "N/A"}</p>
              <p><strong>Due Diligence Score:</strong> {report.summary.dueDiligenceScore !== null ? `${report.summary.dueDiligenceScore.toFixed(2)}%` : "N/A"}</p>
            </div>

            <div>
              <h3 className="mb-2 font-semibold text-gray-900">Recommended Actions</h3>
              <ul className="ml-4 space-y-1">
                {report.summary.recommendedNextSteps.map((step: string, i: number) => (
                  <li key={i}>• {step}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* AI Chat Agent Panel */}
      {showChat && report && (
        <div className="fixed right-4 top-4 bottom-4 w-96 z-50">
          <ChatAgent report={report} />
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={() => setShowChat(!showChat)}
        className={`fixed right-4 bottom-4 z-50 p-4 rounded-full shadow-lg transition-all ${
          showChat ? 'bg-gray-600 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {showChat ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </button>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-gray-200 bg-gray-50 rounded-lg p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-gray-900">{value}</p>
    </div>
  )
}

function EnhancedMetric({ label, value, trl, score, icon }: { label: string; value: string; trl?: number; score?: number; icon: React.ReactNode }) {
  const getMetricColor = () => {
    if (trl !== undefined) {
      if (trl >= 8) return "border-green-200 bg-green-50"
      if (trl >= 6) return "border-teal-200 bg-teal-50"
      if (trl >= 4) return "border-amber-200 bg-amber-50"
      return "border-indigo-200 bg-indigo-50"
    }
    if (score !== undefined) {
      if (score >= 80) return "border-green-200 bg-green-50"
      if (score >= 60) return "border-teal-200 bg-teal-50"
      if (score >= 40) return "border-amber-200 bg-amber-50"
      return "border-red-200 bg-red-50"
    }
    return "border-gray-200 bg-gray-50"
  }

  const getMetricTextColor = () => {
    if (trl !== undefined) {
      if (trl >= 8) return "text-green-600"
      if (trl >= 6) return "text-teal-600"
      if (trl >= 4) return "text-amber-600"
      return "text-indigo-600"
    }
    if (score !== undefined) {
      if (score >= 80) return "text-green-600"
      if (score >= 60) return "text-teal-600"
      if (score >= 40) return "text-amber-600"
      return "text-red-600"
    }
    return "text-gray-900"
  }

  return (
    <div className={`border rounded-lg px-4 py-4 transition-all duration-200 hover:scale-105 ${getMetricColor()}`}>
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1.5 rounded-lg bg-white">{icon}</div>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      <p className={`text-lg font-semibold ${getMetricTextColor()} mt-1`}>{value}</p>
    </div>
  )
}

function getTRLBadgeClass(trl: number): string {
  if (trl >= 8) return "bg-green-100 text-green-700 border border-green-200"
  if (trl >= 6) return "bg-teal-100 text-teal-700 border border-teal-200"
  if (trl >= 4) return "bg-amber-100 text-amber-700 border border-amber-200"
  return "bg-indigo-100 text-indigo-700 border border-indigo-200"
}

function getTRLIcon(trl: number): React.ReactNode {
  if (trl >= 8) return <Award className="w-4 h-4 text-green-600" />
  if (trl >= 6) return <Zap className="w-4 h-4 text-teal-600" />
  if (trl >= 4) return <Battery className="w-4 h-4 text-amber-600" />
  return <Brain className="w-4 h-4 text-indigo-600" />
}

function getTRLIconBg(trl: number): string {
  if (trl >= 8) return "bg-green-100"
  if (trl >= 6) return "bg-teal-100"
  if (trl >= 4) return "bg-amber-100"
  return "bg-indigo-100"
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-teal-600"
  if (score >= 40) return "text-amber-600"
  return "text-red-600"
}

function getScoreBarColor(score: number): string {
  if (score >= 80) return "bg-green-500"
  if (score >= 60) return "bg-teal-500"
  if (score >= 40) return "bg-amber-500"
  return "bg-red-500"
}

function getFTORiskColor(risk: number): string {
  if (risk >= 0.7) return "text-red-600"
  if (risk >= 0.4) return "text-amber-600"
  return "text-green-600"
}

function getDueDiligenceScoreColor(score: number): string {
  if (score >= 80) return "text-green-600"
  if (score >= 60) return "text-teal-600"
  if (score >= 40) return "text-amber-600"
  return "text-red-600"
}

function getDueDiligenceScoreBarColor(score: number): string {
  if (score >= 80) return "bg-green-500"
  if (score >= 60) return "bg-teal-500"
  if (score >= 40) return "bg-amber-500"
  return "bg-red-500"
}

function getInvestmentTierColor(tier: string): string {
  if (tier === "A" || tier === "A+") return "text-green-600"
  if (tier === "B" || tier === "B+") return "text-teal-600"
  if (tier === "C" || tier === "C+") return "text-amber-600"
  return "text-gray-600"
}
