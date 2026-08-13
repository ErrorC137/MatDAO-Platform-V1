"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import toast from "react-hot-toast"

const ESCROW_ABI = [
  "function claimDividends() external nonReentrant"
] as const

interface ClaimDividendsParams {
  escrowAddress: string
}

export function useClaimDividends() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const claimDividends = async ({ escrowAddress }: ClaimDividendsParams) => {
    try {
      toast.loading("Claiming dividends...", { id: "claim-dividends" })
      
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "claimDividends",
      })
      
      toast.loading("Transaction confirming...", { id: "claim-dividends" })
    } catch (err) {
      console.error("Error claiming dividends:", err)
      toast.error("Failed to claim dividends", { id: "claim-dividends" })
      throw err
    }
  }

  if (isSuccess) {
    toast.success("Dividends claimed successfully!", { id: "claim-dividends" })
  }

  return {
    claimDividends,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
