"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import toast from "react-hot-toast"

const ESCROW_ABI = [
  "function approveMilestone(uint256 milestoneId) external onlyOwner",
  "event MilestoneApproved(uint256 indexed milestoneId)"
] as const

interface ApproveMilestoneParams {
  milestoneId: bigint
  escrowAddress: string
}

export function useApproveMilestone() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const approveMilestone = async ({ milestoneId, escrowAddress }: ApproveMilestoneParams) => {
    try {
      toast.loading("Approving milestone...", { id: "approve-milestone" })
      
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "approveMilestone",
        args: [milestoneId],
      })
      
      toast.loading("Transaction confirming...", { id: "approve-milestone" })
    } catch (err) {
      console.error("Error approving milestone:", err)
      toast.error("Failed to approve milestone", { id: "approve-milestone" })
      throw err
    }
  }

  // Show success toast when transaction confirms
  if (isSuccess) {
    toast.success("Milestone approved successfully!", { id: "approve-milestone" })
  }

  return {
    approveMilestone,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
