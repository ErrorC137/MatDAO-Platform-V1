"use client"

import { useState } from "react"
import { Shield, Lock, DollarSign, CheckCircle, Clock, AlertCircle, Sparkles, ChevronRight, Wallet, FileText, TrendingUp } from "lucide-react"

interface Milestone {
  id: string
  title: string
  description: string
  targetAmount: number
  releasedAmount: number
  status: "pending" | "verified" | "released" | "rejected"
  dueDate: string
  verificationStatus?: "pending" | "approved" | "rejected"
}

interface EscrowVault {
  id: string
  projectId: string
  projectTitle: string
  totalFunding: number
  escrowedAmount: number
  releasedAmount: number
  milestones: Milestone[]
  vaultAddress: string
  researcher: string
}

const mockVaults: EscrowVault[] = [
  {
    id: "vault-1",
    projectId: "g-cap-500",
    projectTitle: "G-Cap 500: Ultra-Fast Charging Graphene Batteries",
    totalFunding: 500000,
    escrowedAmount: 500000,
    releasedAmount: 100000,
    vaultAddress: "0xabcd...efgh",
    researcher: "Prof. Dr. Arnon Jenkins",
    milestones: [
      {
        id: "ms-1",
        title: "Proof of Concept",
        description: "Validate graphene supercapacitor concept in lab environment",
        targetAmount: 100000,
        releasedAmount: 100000,
        status: "released",
        dueDate: "2026-06-15",
        verificationStatus: "approved",
      },
      {
        id: "ms-2",
        title: "Prototype Development",
        description: "Build and test prototype with target specifications",
        targetAmount: 150000,
        releasedAmount: 0,
        status: "verified",
        dueDate: "2026-09-15",
        verificationStatus: "approved",
      },
      {
        id: "ms-3",
        title: "Pilot Deployment",
        description: "Deploy pilot in real-world environment",
        targetAmount: 200000,
        releasedAmount: 0,
        status: "pending",
        dueDate: "2026-12-15",
      },
      {
        id: "ms-4",
        title: "Commercialization",
        description: "Scale to commercial production",
        targetAmount: 50000,
        releasedAmount: 0,
        status: "pending",
        dueDate: "2027-03-15",
      },
    ],
  },
  {
    id: "vault-2",
    projectId: "cnt-power-cable",
    projectTitle: "CNT Power Cable for Grid Infrastructure",
    totalFunding: 180000,
    escrowedAmount: 180000,
    releasedAmount: 0,
    vaultAddress: "0x9876...5432",
    researcher: "Dr. Somchai Tanaka",
    milestones: [
      {
        id: "ms-1",
        title: "Proof of Concept",
        description: "Validate CNT cable conductivity",
        targetAmount: 60000,
        releasedAmount: 0,
        status: "pending",
        dueDate: "2026-08-15",
      },
      {
        id: "ms-2",
        title: "Prototype",
        description: "Build prototype cable",
        targetAmount: 60000,
        releasedAmount: 0,
        status: "pending",
        dueDate: "2026-11-15",
      },
      {
        id: "ms-3",
        title: "Pilot",
        description: "Deploy pilot in grid",
        targetAmount: 60000,
        releasedAmount: 0,
        status: "pending",
        dueDate: "2027-02-15",
      },
    ],
  },
]

export default function MilestoneEscrowPage() {
  const [selectedVault, setSelectedVault] = useState<EscrowVault | null>(mockVaults[0])
  const [activeTab, setActiveTab] = useState<"overview" | "milestones" | "transactions">("overview")

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "released":
        return "text-green-400 bg-green-400/10 border-green-400/30"
      case "verified":
        return "text-[#6efcff] bg-[#6efcff]/10 border-[#6efcff]/30"
      case "rejected":
        return "text-red-400 bg-red-400/10 border-red-400/30"
      default:
        return "text-white/60 bg-white/5 border-white/10"
    }
  }

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "released":
        return <CheckCircle className="h-4 w-4" />
      case "verified":
        return <Shield className="h-4 w-4" />
      case "rejected":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getReleaseProgress = (vault: EscrowVault) => {
    return (vault.releasedAmount / vault.escrowedAmount) * 100
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d1a2d] to-[#050510]">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6efcff]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a78bfa]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6efcff]/30 bg-[#6efcff]/10">
                  <Lock className="h-5 w-5 text-[#c5fdff]" />
                </div>
                <h1 className="text-3xl font-bold text-white/95">Milestone Escrow Vaults</h1>
              </div>
              <p className="text-sm text-white/60">
                Protocol-controlled escrow for milestone-based capital release
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vault List */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-4">
              <h2 className="text-lg font-semibold text-white/95 mb-4">Active Vaults</h2>
              <div className="space-y-3">
                {mockVaults.map((vault) => (
                  <button
                    key={vault.id}
                    onClick={() => setSelectedVault(vault)}
                    className={`w-full text-left rounded-xl border p-4 transition-all ${
                      selectedVault?.id === vault.id
                        ? "border-[#6efcff]/30 bg-[#6efcff]/10"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    <h3 className="text-sm font-medium text-white/90 mb-1 line-clamp-1">
                      {vault.projectTitle}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span>{vault.researcher}</span>
                      <span className="text-[#c5fdff]">
                        {Math.round(getReleaseProgress(vault))}% released
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Vault Details */}
          <div className="lg:col-span-2">
            {selectedVault && (
              <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
                {/* Vault Header */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-white/95 mb-2">{selectedVault.projectTitle}</h2>
                      <p className="text-sm text-white/60">Researcher: {selectedVault.researcher}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/50 mb-1">Vault Address</p>
                      <p className="text-sm font-mono text-[#c5fdff]">{selectedVault.vaultAddress}</p>
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-[#6efcff]" />
                        <span className="text-xs text-white/50">Total Funding</span>
                      </div>
                      <p className="text-xl font-bold text-white">${selectedVault.totalFunding.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-[#a78bfa]" />
                        <span className="text-xs text-white/50">Escrowed</span>
                      </div>
                      <p className="text-xl font-bold text-white">${selectedVault.escrowedAmount.toLocaleString()}</p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-400" />
                        <span className="text-xs text-white/50">Released</span>
                      </div>
                      <p className="text-xl font-bold text-white">${selectedVault.releasedAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                  {(["overview", "milestones", "transactions"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab
                          ? "bg-[#6efcff]/20 text-[#c5fdff] border border-[#6efcff]/30"
                          : "text-white/60 hover:text-white/80"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-white/95 mb-4">Release Progress</h3>
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-white/60">Funds Released</span>
                          <span className="text-[#c5fdff]">{Math.round(getReleaseProgress(selectedVault))}%</span>
                        </div>
                        <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#6efcff] to-[#a78bfa] transition-all"
                            style={{ width: `${getReleaseProgress(selectedVault)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-white/95 mb-4">Milestone Summary</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-white/50 mb-1">Total Milestones</p>
                          <p className="text-2xl font-bold text-white">{selectedVault.milestones.length}</p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-white/50 mb-1">Completed</p>
                          <p className="text-2xl font-bold text-green-400">
                            {selectedVault.milestones.filter((m) => m.status === "released").length}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-white/50 mb-1">Verified</p>
                          <p className="text-2xl font-bold text-[#6efcff]">
                            {selectedVault.milestones.filter((m) => m.status === "verified").length}
                          </p>
                        </div>
                        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                          <p className="text-xs text-white/50 mb-1">Pending</p>
                          <p className="text-2xl font-bold text-white/60">
                            {selectedVault.milestones.filter((m) => m.status === "pending").length}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "milestones" && (
                  <div className="space-y-4">
                    {selectedVault.milestones.map((milestone, index) => (
                      <div
                        key={milestone.id}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-3">
                            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${getStatusColor(milestone.status)}`}>
                              {getStatusIcon(milestone.status)}
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-white/90">{milestone.title}</h4>
                              <p className="text-xs text-white/50 mt-1">{milestone.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-white">${milestone.targetAmount.toLocaleString()}</p>
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs border ${getStatusColor(milestone.status)}`}>
                              {milestone.status.charAt(0).toUpperCase() + milestone.status.slice(1)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-white/50 pt-3 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            <span>Due: {milestone.dueDate}</span>
                          </div>
                          {milestone.status === "verified" && (
                            <button className="flex items-center gap-2 text-[#6efcff] hover:text-[#6efcff]/80 transition-colors">
                              <Sparkles className="h-3 w-3" />
                              Release Funds
                              <ChevronRight className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "transactions" && (
                  <div className="space-y-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
                      <Wallet className="h-12 w-12 text-[#6efcff] mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-white/95 mb-2">Transaction History</h3>
                      <p className="text-sm text-white/60 mb-4">
                        View all fund releases and escrow transactions on-chain
                      </p>
                      <button className="flex items-center justify-center gap-2 rounded-xl border border-[#6efcff]/30 bg-[#6efcff]/10 px-4 py-2 text-sm text-[#c5fdff] hover:bg-[#6efcff]/20 transition-all">
                        <FileText className="h-4 w-4" />
                        View on Block Explorer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
