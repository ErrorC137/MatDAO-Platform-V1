"use client"

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import toast from "react-hot-toast"

const MOCK_USDC_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
] as const

const ESCROW_ABI = [
  "function fundProject(uint256 amount) external",
  "function getFundingProgress() public view returns (uint256 current, uint256 goal, uint256 percentage)"
] as const

interface FundProjectParams {
  amount: bigint
  escrowAddress: string
  tokenAddress: string
}

export function useFundProject() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const fundProject = async ({ amount, escrowAddress, tokenAddress }: FundProjectParams) => {
    try {
      toast.loading("Approving token spend...", { id: "fund-project" })
      
      // First approve the escrow contract to spend tokens
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: MOCK_USDC_ABI,
        functionName: "approve",
        args: [escrowAddress as `0x${string}`, amount],
      })
      
      toast.loading("Funding project...", { id: "fund-project" })
      
      // Then fund the project
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "fundProject",
        args: [amount],
      })
      
      toast.loading("Transaction confirming...", { id: "fund-project" })
    } catch (err) {
      console.error("Error funding project:", err)
      toast.error("Failed to fund project", { id: "fund-project" })
      throw err
    }
  }

  // Show success toast when transaction confirms
  if (isSuccess) {
    toast.success("Project funded successfully!", { id: "fund-project" })
  }

  return {
    fundProject,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useFundingProgress(escrowAddress: string) {
  const { data, isLoading, error } = useReadContract({
    address: escrowAddress as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: "getFundingProgress",
  })

  return {
    current: data?.[0] || 0n,
    goal: data?.[1] || 0n,
    percentage: data?.[2] || 0n,
    isLoading,
    error,
  }
}
