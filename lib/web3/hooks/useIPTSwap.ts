"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import toast from "react-hot-toast"

const SWAP_ABI = [
  "function swapUSDCForIPT(uint256 usdcAmount) external nonReentrant",
  "function swapIPTForUSDC(uint256 iptAmount) external nonReentrant"
] as const

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)"
] as const

interface SwapUSDCForIPTParams {
  swapAddress: string
  usdcAddress: string
  usdcAmount: number
}

interface SwapIPTForUSDCParams {
  swapAddress: string
  iptAddress: string
  iptAmount: number
}

interface ApproveTokenParams {
  tokenAddress: string
  spenderAddress: string
  amount: number
}

export function useIPTSwap() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const approveToken = async ({ tokenAddress, spenderAddress, amount }: ApproveTokenParams) => {
    try {
      toast.loading("Approving token spend...", { id: "approve-token" })
      
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [spenderAddress as `0x${string}`, parseUnits(amount.toString(), 6)],
      })
      
      toast.loading("Transaction confirming...", { id: "approve-token" })
    } catch (err) {
      console.error("Error approving token:", err)
      toast.error("Failed to approve token", { id: "approve-token" })
      throw err
    }
  }

  const swapUSDCForIPT = async ({ swapAddress, usdcAddress, usdcAmount }: SwapUSDCForIPTParams) => {
    try {
      toast.loading("Swapping USDC for IPT...", { id: "swap-usdc-ipt" })
      
      await writeContract({
        address: swapAddress as `0x${string}`,
        abi: SWAP_ABI,
        functionName: "swapUSDCForIPT",
        args: [parseUnits(usdcAmount.toString(), 6)],
      })
      
      toast.loading("Transaction confirming...", { id: "swap-usdc-ipt" })
    } catch (err) {
      console.error("Error swapping USDC for IPT:", err)
      toast.error("Failed to swap USDC for IPT", { id: "swap-usdc-ipt" })
      throw err
    }
  }

  const swapIPTForUSDC = async ({ swapAddress, iptAddress, iptAmount }: SwapIPTForUSDCParams) => {
    try {
      toast.loading("Swapping IPT for USDC...", { id: "swap-ipt-usdc" })
      
      await writeContract({
        address: swapAddress as `0x${string}`,
        abi: SWAP_ABI,
        functionName: "swapIPTForUSDC",
        args: [parseUnits(iptAmount.toString(), 6)],
      })
      
      toast.loading("Transaction confirming...", { id: "swap-ipt-usdc" })
    } catch (err) {
      console.error("Error swapping IPT for USDC:", err)
      toast.error("Failed to swap IPT for USDC", { id: "swap-ipt-usdc" })
      throw err
    }
  }

  return {
    approveToken,
    swapUSDCForIPT,
    swapIPTForUSDC,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
