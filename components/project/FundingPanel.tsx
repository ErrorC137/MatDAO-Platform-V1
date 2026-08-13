"use client"

import { useState } from "react"
import { DollarSign, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { useFundProject, useFundingProgress } from "@/lib/web3/hooks/useFundProject"
import { useApproveMilestone } from "@/lib/web3/hooks/useApproveMilestone"
import { useClaimMilestone } from "@/lib/web3/hooks/useClaimMilestone"
import { CONTRACT_ADDRESSES } from "@/lib/web3/config"
import { useAuth } from "@/context/auth-context"

interface Milestone {
  id: number
  description: string
  amount: number
  isApproved: boolean
  isWithdrawn: boolean
}

interface FundingPanelProps {
  projectId: string
  milestones: Milestone[]
  escrowAddress?: string
  tokenAddress?: string
}

export function FundingPanel({ projectId, milestones, escrowAddress, tokenAddress }: FundingPanelProps) {
  const { user } = useAuth()
  const [fundAmount, setFundAmount] = useState(1000)
  const { fundProject, isPending: isFunding, isSuccess: isFunded } = useFundProject()
  const { approveMilestone, isPending: isApproving } = useApproveMilestone()
  const { claimMilestone, isPending: isClaiming } = useClaimMilestone()
  const { current, goal, percentage } = useFundingProgress(escrowAddress || CONTRACT_ADDRESSES.MATDAO_ESCROW || "0x0")

  const handleFund = async () => {
    if (!escrowAddress || !tokenAddress) return
    try {
      await fundProject({
        amount: BigInt(fundAmount * 10**6), // USDC has 6 decimals
        escrowAddress,
        tokenAddress
      })
    } catch (error) {
      console.error("Error funding project:", error)
    }
  }

  const handleApprove = async (milestoneId: number) => {
    if (!escrowAddress) return
    try {
      await approveMilestone({
        milestoneId: BigInt(milestoneId),
        escrowAddress
      })
    } catch (error) {
      console.error("Error approving milestone:", error)
    }
  }

  const handleClaim = async (milestoneId: number) => {
    if (!escrowAddress) return
    try {
      await claimMilestone({
        milestoneId: BigInt(milestoneId),
        escrowAddress
      })
    } catch (error) {
      console.error("Error claiming milestone:", error)
    }
  }

  const isStaff = user?.role === "staff"
  const isResearcher = user?.role === "researcher"

  return (
    <div className="rounded-xl border border-border/60 bg-card p-6">
      <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-foreground">
        <DollarSign className="h-5 w-5 text-primary" />
        Funding & Milestones
      </h2>

      {/* Funding Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Funding Progress</span>
          <span className="text-sm font-semibold text-foreground">
            ${Number(current) / 10**6} / ${Number(goal) / 10**6} ({Number(percentage)}%)
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-border/40">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${Math.min(Number(percentage), 100)}%` }}
          />
        </div>
      </div>

      {/* Fund Project */}
      {user && !isStaff && !isResearcher && (
        <div className="mb-6 rounded-lg border border-border/60 bg-secondary/20 p-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">Fund This Project</h3>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={fundAmount}
              onChange={(e) => setFundAmount(Number(e.target.value))}
              className="w-32 rounded-lg border border-border/60 bg-background px-3 py-2 text-sm text-foreground"
              placeholder="Amount"
            />
            <span className="text-sm text-muted-foreground">USDC</span>
            <button
              onClick={handleFund}
              disabled={isFunding || !escrowAddress || !tokenAddress}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isFunding ? "Funding..." : "Fund"}
            </button>
          </div>
        </div>
      )}

      {/* Milestones */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Milestones</h3>
        {milestones.map((milestone) => (
          <div key={milestone.id} className="rounded-lg border border-border/60 bg-secondary/20 p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">{milestone.description}</span>
                  {milestone.isApproved && !milestone.isWithdrawn && (
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                  )}
                  {milestone.isWithdrawn && (
                    <CheckCircle className="h-4 w-4 text-primary" />
                  )}
                  {!milestone.isApproved && (
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">${milestone.amount.toLocaleString()} USDC</p>
              </div>
              <div className="flex gap-2">
                {isStaff && !milestone.isApproved && (
                  <button
                    onClick={() => handleApprove(milestone.id)}
                    disabled={isApproving}
                    className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
                  >
                    {isApproving ? "Approving..." : "Approve"}
                  </button>
                )}
                {isResearcher && milestone.isApproved && !milestone.isWithdrawn && (
                  <button
                    onClick={() => handleClaim(milestone.id)}
                    disabled={isClaiming}
                    className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50"
                  >
                    {isClaiming ? "Claiming..." : "Claim"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!escrowAddress && (
        <div className="mt-4 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
            <p className="text-xs text-amber-400">
              Smart contract not deployed. Funding and milestone features will be available after contract deployment.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
