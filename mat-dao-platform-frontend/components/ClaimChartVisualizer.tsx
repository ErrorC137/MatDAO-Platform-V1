"use client"

import { useState } from "react"
import { Table, Check, X, AlertCircle, FileText, Download, ZoomIn, ZoomOut } from "lucide-react"

interface ClaimElement {
  id: string
  text: string
  noveltyScore: number
  priorArtMatches: string[]
}

interface ClaimChartProps {
  patentClaims: ClaimElement[]
  priorArtClaims: ClaimElement[]
  comparisonMatrix?: boolean[][]
}

export default function ClaimChartVisualizer({
  patentClaims,
  priorArtClaims,
  comparisonMatrix
}: ClaimChartProps) {
  const [zoom, setZoom] = useState(1)
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null)

  const getNoveltyColor = (score: number) => {
    if (score >= 0.7) return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
    if (score >= 0.4) return "bg-amber-500/20 text-amber-400 border-amber-500/40"
    return "bg-red-500/20 text-red-400 border-red-500/40"
  }

  const getNoveltyLabel = (score: number) => {
    if (score >= 0.7) return "Novel"
    if (score >= 0.4) return "Moderate"
    return "Anticipated"
  }

  const generateComparisonMatrix = () => {
    if (comparisonMatrix) return comparisonMatrix
    
    // Generate matrix based on similarity scores
    return patentClaims.map(claim =>
      priorArtClaims.map(prior => {
        const similarity = calculateSimilarity(claim.text, prior.text)
        return similarity > 0.7
      })
    )
  }

  const calculateSimilarity = (text1: string, text2: string): number => {
    const words1 = text1.toLowerCase().split(/\s+/)
    const words2 = text2.toLowerCase().split(/\s+/)
    const intersection = words1.filter(word => words2.includes(word))
    const union = [...new Set([...words1, ...words2])]
    return intersection.length / union.length
  }

  const matrix = generateComparisonMatrix()

  const exportChart = () => {
    const data = {
      patentClaims,
      priorArtClaims,
      comparisonMatrix: matrix,
      generatedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "claim-chart-analysis.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6efcff]/30 to-[#6efcff]/10">
            <Table className="w-6 h-6 text-[#c5fdff]" />
          </div>
          <div>
            <h2 className="font-headline text-xl font-bold text-white/95">Claim Chart Analysis</h2>
            <p className="text-sm text-white/50">Compare patent claims against prior art</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 transition-all"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm text-white/50 w-12 text-center">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
            className="p-2 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 transition-all"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={exportChart}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#6efcff]/40 bg-[#6efcff]/10 text-[#c5fdff] hover:bg-[#6efcff]/20 transition-all"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="overflow-x-auto" style={{ transform: `scale(${zoom})`, transformOrigin: "top left" }}>
        {/* Patent Claims */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#c5fdff] mb-4 uppercase tracking-wider">Patent Claims</h3>
          <div className="space-y-3">
            {patentClaims.map((claim, index) => (
              <div
                key={claim.id}
                onClick={() => setSelectedClaim(claim.id)}
                className={`rounded-xl border p-4 cursor-pointer transition-all ${
                  selectedClaim === claim.id
                    ? "border-[#6efcff]/40 bg-[#6efcff]/10"
                    : "border-white/10 bg-black/20 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white/50">Claim {index + 1}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getNoveltyColor(claim.noveltyScore)}`}>
                      {getNoveltyLabel(claim.noveltyScore)}
                    </span>
                  </div>
                  <span className="text-xs text-white/50">{(claim.noveltyScore * 100).toFixed(0)}% Novelty</span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{claim.text}</p>
                {claim.priorArtMatches.length > 0 && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-amber-400">
                    <AlertCircle className="w-3 h-3" />
                    <span>Matches: {claim.priorArtMatches.join(", ")}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Prior Art Claims */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-[#c5fdff] mb-4 uppercase tracking-wider">Prior Art Claims</h3>
          <div className="space-y-3">
            {priorArtClaims.map((claim, index) => (
              <div
                key={claim.id}
                className="rounded-xl border border-white/10 bg-black/20 p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-white/50">Prior Art {index + 1}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getNoveltyColor(claim.noveltyScore)}`}>
                    {getNoveltyLabel(claim.noveltyScore)}
                  </span>
                </div>
                <p className="text-sm text-white/70 leading-relaxed">{claim.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Matrix */}
        <div>
          <h3 className="text-sm font-semibold text-[#c5fdff] mb-4 uppercase tracking-wider">Claim Comparison Matrix</h3>
          <div className="rounded-xl border border-white/10 bg-black/20 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-white/50">Claim</th>
                  {priorArtClaims.map((_, index) => (
                    <th key={index} className="px-4 py-3 text-center text-xs font-semibold text-white/50">
                      Prior {index + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {patentClaims.map((claim, rowIndex) => (
                  <tr key={claim.id} className="border-b border-white/10 last:border-0">
                    <td className="px-4 py-3 text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#c5fdff]" />
                        <span className="truncate max-w-xs">Claim {rowIndex + 1}</span>
                      </div>
                    </td>
                    {priorArtClaims.map((_, colIndex) => {
                      const isMatch = matrix[rowIndex][colIndex]
                      return (
                        <td key={colIndex} className="px-4 py-3 text-center">
                          {isMatch ? (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-500/20 text-red-400">
                              <X className="w-4 h-4" />
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400">
                              <Check className="w-4 h-4" />
                            </div>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 flex items-center gap-6 text-xs text-white/50">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <span>No overlap (novel)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="w-3 h-3 text-red-400" />
              </div>
              <span>Overlap (anticipated)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-6 border-t border-white/10">
        <h4 className="text-xs font-semibold text-white/50 mb-3 uppercase tracking-wider">Novelty Scoring</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
            <p className="text-xs font-semibold text-emerald-400 mb-1">Novel (≥70%)</p>
            <p className="text-xs text-white/50">Strong patentability potential</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <p className="text-xs font-semibold text-amber-400 mb-1">Moderate (40-70%)</p>
            <p className="text-xs text-white/50">May require claim refinement</p>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-xs font-semibold text-red-400 mb-1">Anticipated (&lt;40%)</p>
            <p className="text-xs text-white/50">Consider narrower claims</p>
          </div>
        </div>
      </div>
    </div>
  )
}
