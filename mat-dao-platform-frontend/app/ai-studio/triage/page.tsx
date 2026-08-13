"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { FileUp, Loader2, FileText, X, ArrowUpDown, TrendingUp, Shield, DollarSign } from "lucide-react"
import { BackendStatus } from "@/components/ai-studio/BackendStatus"
import { runCombinedAssessment } from "@/lib/trl-services/combined-report"
import type { CombinedAssessmentReport } from "@/lib/trl-services/types"

interface DocumentAnalysis {
  id: string
  file: File
  title: string
  status: "pending" | "analyzing" | "completed" | "error"
  report?: CombinedAssessmentReport
  error?: string
}

export default function TriagePage() {
  const router = useRouter()
  const [documents, setDocuments] = useState<DocumentAnalysis[]>([])
  const [analyzing, setAnalyzing] = useState(false)
  const [sortBy, setSortBy] = useState<"trl" | "valuation" | "originality" | "overall">("overall")

  const addDocument = (file: File) => {
    const id = Math.random().toString(36).substr(2, 9)
    setDocuments([...documents, {
      id,
      file,
      title: file.name,
      status: "pending",
    }])
  }

  const removeDocument = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id))
  }

  const analyzeAll = useCallback(async () => {
    if (documents.length === 0) return

    setAnalyzing(true)
    
    // Update all to analyzing status
    setDocuments(docs => docs.map(doc => ({ ...doc, status: "analyzing" as const })))

    // Analyze each document
    const updatedDocs = [...documents]
    for (let i = 0; i < updatedDocs.length; i++) {
      const doc = updatedDocs[i]
      try {
        const textContent = await doc.file.text()
        const report = await runCombinedAssessment({
          title: doc.title,
          author: "",
          category: "Deep Tech",
          textContent,
          file: doc.file,
        })
        updatedDocs[i] = { ...doc, status: "completed" as const, report }
      } catch (err) {
        updatedDocs[i] = { 
          ...doc, 
          status: "error" as const, 
          error: err instanceof Error ? err.message : "Analysis failed" 
        }
      }
      setDocuments([...updatedDocs])
    }

    setAnalyzing(false)
  }, [documents])

  const getScore = (doc: DocumentAnalysis, metric: string): number => {
    if (!doc.report) return 0

    switch (metric) {
      case "trl":
        return doc.report.ipReport?.trl_evaluation?.trl || 0
      case "valuation":
        return doc.report.ipReport?.valuation?.v_target_usd || 0
      case "originality":
        // Convert similarity to originality score (lower similarity = higher originality)
        const similarity = doc.report.ipReport?.originality?.max_cosine_similarity || 1
        return Math.max(0, 1 - similarity) * 100
      case "overall":
        // Calculate overall score as weighted average
        const trl = doc.report.ipReport?.trl_evaluation?.trl || 0
        const valuation = doc.report.ipReport?.valuation?.v_target_usd || 0
        const originality = Math.max(0, 1 - (doc.report.ipReport?.originality?.max_cosine_similarity || 1)) * 100
        // Normalize and weight: TRL (30%), Originality (40%), Valuation log scale (30%)
        const trlScore = (trl / 9) * 30
        const originalityScore = originality * 0.4
        const valuationScore = Math.min(Math.log10(Math.max(valuation, 1)) / 7 * 30, 30)
        return trlScore + originalityScore + valuationScore
      default:
        return 0
    }
  }

  const getSortedDocuments = () => {
    return [...documents].sort((a, b) => {
      const scoreA = getScore(a, sortBy)
      const scoreB = getScore(b, sortBy)
      return scoreB - scoreA // Descending order
    })
  }

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">1st</span>
    if (index === 1) return <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">2nd</span>
    if (index === 2) return <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">3rd</span>
    return <span className="bg-blue-50 text-blue-800 text-xs font-medium px-2 py-1 rounded">{index + 1}th</span>
  }

  const viewDetails = (docId: string) => {
    const doc = documents.find(d => d.id === docId)
    if (doc?.report) {
      sessionStorage.setItem("matdao-combined-report", JSON.stringify(doc.report))
      router.push("/ai-studio/project-assessment/results")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-gray-100">
              <ArrowUpDown className="h-5 w-5 text-gray-700" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Document Triage & Scorecard</h1>
          </div>
          <p className="text-sm text-gray-600">
            Upload multiple documents to compare and rank them by key metrics
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Upload Panel */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upload Documents</h2>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.docx,.txt"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || [])
                    files.forEach(addDocument)
                  }}
                  className="hidden"
                  id="file-upload"
                  disabled={analyzing}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 mb-2">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, DOCX, or TXT files
                  </p>
                </label>
              </div>

              {/* Document List */}
              {documents.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h3 className="text-sm font-medium text-gray-700">Documents ({documents.length})</h3>
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="text-sm text-gray-700 truncate">{doc.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {doc.status === "completed" && (
                          <span className="text-xs text-green-600">✓</span>
                        )}
                        {doc.status === "error" && (
                          <span className="text-xs text-red-600">✗</span>
                        )}
                        {!analyzing && (
                          <button
                            onClick={() => removeDocument(doc.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={analyzeAll}
                disabled={documents.length === 0 || analyzing}
                className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {analyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  "Analyze All Documents"
                )}
              </button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <BackendStatus />
              </div>
            </div>
          </div>

          {/* Scorecard Panel */}
          <div className="lg:col-span-2">
            <div className="border border-gray-200 bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Ranked Scorecard</h2>
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm"
                  >
                    <option value="overall">Overall Score</option>
                    <option value="trl">TRL Level</option>
                    <option value="valuation">Valuation</option>
                    <option value="originality">Originality</option>
                  </select>
                </div>
              </div>

              {documents.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Upload documents to see the ranked scorecard</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {getSortedDocuments().map((doc, index) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
                      onClick={() => doc.status === "completed" && viewDetails(doc.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getRankBadge(index)}
                          <div>
                            <h3 className="font-medium text-gray-900">{doc.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              Status: {doc.status === "completed" ? "Analyzed" : doc.status}
                            </p>
                          </div>
                        </div>
                        {doc.status === "completed" && doc.report && (
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              {getScore(doc, sortBy).toFixed(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                              {sortBy === "overall" ? "Overall Score" : sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
                            </div>
                          </div>
                        )}
                      </div>

                      {doc.status === "completed" && doc.report && (
                        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <Shield className="h-4 w-4 text-purple-600" />
                            <div>
                              <p className="text-xs text-gray-500">TRL</p>
                              <p className="text-sm font-medium text-gray-900">
                                {doc.report.ipReport?.trl_evaluation?.trl || "N/A"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <div>
                              <p className="text-xs text-gray-500">Valuation</p>
                              <p className="text-sm font-medium text-gray-900">
                                ${((doc.report.ipReport?.valuation?.v_target_usd || 0) / 1000000).toFixed(1)}M
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                            <div>
                              <p className="text-xs text-gray-500">Originality</p>
                              <p className="text-sm font-medium text-gray-900">
                                {getScore(doc, "originality").toFixed(0)}%
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {doc.status === "error" && (
                        <div className="mt-3 text-sm text-red-600">
                          Error: {doc.error}
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
