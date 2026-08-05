"use client"

import { useState } from "react"
import { Shield, CheckCircle, XCircle, Clock, FileText, User, Building2, AlertTriangle } from "lucide-react"

interface ComplianceSubmission {
  id: string
  title: string
  submitter: string
  submitterType: "individual" | "entity"
  submittedAt: string
  status: "pending" | "approved" | "rejected" | "review"
  kycStatus: "verified" | "pending" | "failed"
  kycScore: number
  ipAnalysis: {
    noveltyScore: number
    nonObviousnessScore: number
    patentability: string
  }
  legalCitations: {
    total: number
    verified: number
    invalid: number
  }
  riskLevel: "low" | "medium" | "high"
}

export default function TTOCompliancePortal() {
  const [submissions, setSubmissions] = useState<ComplianceSubmission[]>([
    {
      id: "1",
      title: "Advanced Carbon Capture Membrane Technology",
      submitter: "0x1234...5678",
      submitterType: "entity",
      submittedAt: "2024-01-15T10:30:00Z",
      status: "pending",
      kycStatus: "verified",
      kycScore: 0.85,
      ipAnalysis: {
        noveltyScore: 0.78,
        nonObviousnessScore: 0.72,
        patentability: "Strong patentability potential"
      },
      legalCitations: {
        total: 12,
        verified: 10,
        invalid: 2
      },
      riskLevel: "low"
    },
    {
      id: "2",
      title: "Novel Battery Electrolyte Composition",
      submitter: "0xabcd...efgh",
      submitterType: "individual",
      submittedAt: "2024-01-14T14:20:00Z",
      status: "review",
      kycStatus: "pending",
      kycScore: 0.0,
      ipAnalysis: {
        noveltyScore: 0.65,
        nonObviousnessScore: 0.58,
        patentability: "Moderate patentability potential"
      },
      legalCitations: {
        total: 8,
        verified: 6,
        invalid: 2
      },
      riskLevel: "medium"
    },
    {
      id: "3",
      title: "AI-Driven Drug Discovery Platform",
      submitter: "0x9876...5432",
      submitterType: "entity",
      submittedAt: "2024-01-13T09:15:00Z",
      status: "approved",
      kycStatus: "verified",
      kycScore: 0.92,
      ipAnalysis: {
        noveltyScore: 0.85,
        nonObviousnessScore: 0.80,
        patentability: "Strong patentability potential"
      },
      legalCitations: {
        total: 15,
        verified: 15,
        invalid: 0
      },
      riskLevel: "low"
    }
  ])

  const [selectedSubmission, setSelectedSubmission] = useState<ComplianceSubmission | null>(null)
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all")

  const filteredSubmissions = submissions.filter(s => 
    filter === "all" ? true : s.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      case "rejected": return "text-red-400 bg-red-500/10 border-red-500/30"
      case "review": return "text-amber-400 bg-amber-500/10 border-amber-500/30"
      default: return "text-blue-400 bg-blue-500/10 border-blue-500/30"
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low": return "text-emerald-400"
      case "medium": return "text-amber-400"
      case "high": return "text-red-400"
      default: return "text-gray-400"
    }
  }

  const handleApprove = (id: string) => {
    setSubmissions(subs => subs.map(s => 
      s.id === id ? { ...s, status: "approved" as const } : s
    ))
  }

  const handleReject = (id: string) => {
    setSubmissions(subs => subs.map(s => 
      s.id === id ? { ...s, status: "rejected" as const } : s
    ))
  }

  const handleRequestReview = (id: string) => {
    setSubmissions(subs => subs.map(s => 
      s.id === id ? { ...s, status: "review" as const } : s
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-black px-5 py-12 sm:px-6">
      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-[#6efcff]/30 to-[#6efcff]/10">
              <Shield className="w-6 h-6 text-[#c5fdff]" />
            </div>
            <div>
              <h1 className="font-headline text-3xl font-bold text-white/95">TTO Compliance Portal</h1>
              <p className="text-sm text-white/50">Review and approve IP submissions for institutional compliance</p>
            </div>
          </div>
          
          {/* Filter Tabs */}
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filter === f
                    ? "bg-[#6efcff]/20 text-[#c5fdff] border border-[#6efcff]/40"
                    : "bg-white/5 text-white/60 border border-white/10 hover:bg-white/10"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
            <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Total Submissions</p>
            <p className="text-2xl font-bold text-white/90">{submissions.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
            <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Pending Review</p>
            <p className="text-2xl font-bold text-[#c5fdff]">{submissions.filter(s => s.status === "pending").length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
            <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Approved</p>
            <p className="text-2xl font-bold text-emerald-400">{submissions.filter(s => s.status === "approved").length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/30 p-5 backdrop-blur-sm">
            <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">KYC Verified</p>
            <p className="text-2xl font-bold text-purple-400">{submissions.filter(s => s.kycStatus === "verified").length}</p>
          </div>
        </div>

        {/* Submissions List */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List View */}
          <div className="lg:col-span-2 space-y-4">
            {filteredSubmissions.map((submission) => (
              <div
                key={submission.id}
                onClick={() => setSelectedSubmission(submission)}
                className={`rounded-2xl border p-5 backdrop-blur-sm cursor-pointer transition-all ${
                  selectedSubmission?.id === submission.id
                    ? "border-[#6efcff]/40 bg-gradient-to-br from-[#6efcff]/10 to-[#6efcff]/5"
                    : "border-white/10 bg-black/30 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-white/90">{submission.title}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${getStatusColor(submission.status)}`}>
                        {submission.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-white/50">
                      <div className="flex items-center gap-1">
                        {submission.submitterType === "entity" ? (
                          <Building2 className="w-4 h-4" />
                        ) : (
                          <User className="w-4 h-4" />
                        )}
                        <span>{submission.submitter}</span>
                      </div>
                      <span>•</span>
                      <span>{new Date(submission.submittedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm font-semibold ${getRiskColor(submission.riskLevel)}`}>
                    <AlertTriangle className="w-4 h-4" />
                    <span>{submission.riskLevel.toUpperCase()} RISK</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white/50 mb-1">KYC Status</p>
                    <p className={`font-semibold ${submission.kycStatus === "verified" ? "text-emerald-400" : "text-amber-400"}`}>
                      {submission.kycStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Novelty Score</p>
                    <p className="font-semibold text-white/90">{(submission.ipAnalysis.noveltyScore * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Citations</p>
                    <p className="font-semibold text-white/90">{submission.legalCitations.verified}/{submission.legalCitations.total}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail View */}
          {selectedSubmission && (
            <div className="rounded-2xl border border-white/10 bg-black/30 p-6 backdrop-blur-sm">
              <h2 className="font-headline text-xl font-bold text-white/95 mb-6">Compliance Review</h2>
              
              {/* Submission Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Title</p>
                  <p className="text-base font-semibold text-white/90">{selectedSubmission.title}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Submitter</p>
                    <p className="text-sm text-white/70">{selectedSubmission.submitter}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">Type</p>
                    <p className="text-sm text-white/70 capitalize">{selectedSubmission.submitterType}</p>
                  </div>
                </div>
              </div>

              {/* KYC Status */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-5 h-5 text-[#c5fdff]" />
                  <h3 className="font-semibold text-white/90">KYC/KYB Verification</h3>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/50 mb-1">Status</p>
                    <p className={`font-semibold ${selectedSubmission.kycStatus === "verified" ? "text-emerald-400" : "text-amber-400"}`}>
                      {selectedSubmission.kycStatus}
                    </p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Score</p>
                    <p className="font-semibold text-white/90">{(selectedSubmission.kycScore * 100).toFixed(0)}%</p>
                  </div>
                </div>
              </div>

              {/* IP Analysis */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#c5fdff]" />
                  <h3 className="font-semibold text-white/90">IP Analysis</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-white/50 mb-1">Novelty Score</p>
                    <p className="font-semibold text-white/90">{(selectedSubmission.ipAnalysis.noveltyScore * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Non-Obviousness Score</p>
                    <p className="font-semibold text-white/90">{(selectedSubmission.ipAnalysis.nonObviousnessScore * 100).toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Patentability</p>
                    <p className="font-semibold text-white/90">{selectedSubmission.ipAnalysis.patentability}</p>
                  </div>
                </div>
              </div>

              {/* Legal Citations */}
              <div className="rounded-xl border border-white/10 bg-black/20 p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-5 h-5 text-[#c5fdff]" />
                  <h3 className="font-semibold text-white/90">Legal Citations</h3>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-white/50 mb-1">Total</p>
                    <p className="font-semibold text-white/90">{selectedSubmission.legalCitations.total}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Verified</p>
                    <p className="font-semibold text-emerald-400">{selectedSubmission.legalCitations.verified}</p>
                  </div>
                  <div>
                    <p className="text-white/50 mb-1">Invalid</p>
                    <p className="font-semibold text-red-400">{selectedSubmission.legalCitations.invalid}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedSubmission.status === "pending" && (
                <div className="space-y-2">
                  <button
                    onClick={() => handleApprove(selectedSubmission.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400 hover:bg-emerald-500/20 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Submission
                  </button>
                  <button
                    onClick={() => handleRequestReview(selectedSubmission.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-semibold text-amber-400 hover:bg-amber-500/20 transition-all"
                  >
                    <Clock className="w-4 h-4" />
                    Request Additional Review
                  </button>
                  <button
                    onClick={() => handleReject(selectedSubmission.id)}
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject Submission
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
