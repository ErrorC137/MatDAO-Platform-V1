"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import toast from "react-hot-toast"

const ESCROW_ABI = [
  "function claimMilestone(uint256 milestoneId) external",
  "event MilestoneClaimed(uint256 indexed milestoneId, uint256 amount)"
] as const

interface ClaimMilestoneParams {
  milestoneId: bigint
  escrowAddress: string
}

export function useClaimMilestone() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claimMilestone = async ({ milestoneId, escrowAddress }: ClaimMilestoneParams) => {
    try {
      toast.loading("Claiming milestone funds...", { id: "claim-milestone" })
      
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "claimMilestone",
        args: [milestoneId],
      })
      
      toast.loading("Transaction confirming...", { id: "claim-milestone" })
    } catch (err) {
      console.error("Error claiming milestone:", err)
      toast.error("Failed to claim milestone funds", { id: "claim-milestone" })
      throw err
    }
  }

  // Show success toast when transaction confirms
  if (isSuccess) {
    toast.success("Milestone funds claimed successfully!", { id: "claim-milestone" })
  }

  return {
    claimMilestone,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
