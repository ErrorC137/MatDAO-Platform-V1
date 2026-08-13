"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import toast from "react-hot-toast"

const ESCROW_ABI = [
  "function claimEmergencyRefund() external nonReentrant"
] as const

interface ClaimEmergencyRefundParams {
  escrowAddress: string
}

export function useEmergencyRefund() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claimEmergencyRefund = async ({ escrowAddress }: ClaimEmergencyRefundParams) => {
    try {
      toast.loading("Claiming emergency refund...", { id: "emergency-refund" })
      
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "claimEmergencyRefund",
      })
      
      toast.loading("Transaction confirming...", { id: "emergency-refund" })
    } catch (err) {
      console.error("Error claiming emergency refund:", err)
      toast.error("Failed to claim emergency refund", { id: "emergency-refund" })
      throw err
    }
  }

  if (isSuccess) {
    toast.success("Emergency refund claimed successfully!", { id: "emergency-refund" })
  }

  return {
    claimEmergencyRefund,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
