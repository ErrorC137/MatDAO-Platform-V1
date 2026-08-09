"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import toast from "react-hot-toast"

const ESCROW_ABI = [
  "function depositRoyalties(uint256 amount) external nonReentrant"
] as const

interface DepositRoyaltiesParams {
  escrowAddress: string
  amount: number
}

export function useRoyaltyDeposit() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const depositRoyalties = async ({ escrowAddress, amount }: DepositRoyaltiesParams) => {
    try {
      toast.loading("Depositing royalties...", { id: "deposit-royalties" })
      
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "depositRoyalties",
        args: [parseUnits(amount.toString(), 6)],
      })
      
      toast.loading("Transaction confirming...", { id: "deposit-royalties" })
    } catch (err) {
      console.error("Error depositing royalties:", err)
      toast.error("Failed to deposit royalties", { id: "deposit-royalties" })
      throw err
    }
  }

  if (isSuccess) {
    toast.success("Royalties deposited successfully!", { id: "deposit-royalties" })
  }

  return {
    depositRoyalties,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
