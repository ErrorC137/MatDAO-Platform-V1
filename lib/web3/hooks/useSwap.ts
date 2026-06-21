"use client"

import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import toast from "react-hot-toast"

const SWAP_ROUTER_ABI = [
  "function swapETHForUSDC(address usdcAddress) external payable",
  "function swapUSDCForETH(address usdcAddress, uint256 usdcAmount) external",
  "function getQuoteETHForUSDC(uint256 ethAmount) external pure returns (uint256 usdcAmount)",
  "function getQuoteUSDCForETH(uint256 usdcAmount) external pure returns (uint256 ethAmount)",
  "function getExchangeRate() external pure returns (uint256 ethPerUsdc, uint256 usdcPerEth)"
] as const

interface SwapETHForUSDCParams {
  usdcAddress: string
  ethAmount: bigint
}

interface SwapUSDCForETHParams {
  usdcAddress: string
  usdcAmount: bigint
}

export function useSwap() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const swapETHForUSDC = async ({ usdcAddress, ethAmount }: SwapETHForUSDCParams) => {
    try {
      toast.loading("Swapping ETH for USDC...", { id: "swap-eth" })
      
      await writeContract({
        address: process.env.NEXT_PUBLIC_SWAP_ROUTER_ADDRESS as `0x${string}`,
        abi: SWAP_ROUTER_ABI,
        functionName: "swapETHForUSDC",
        args: [usdcAddress as `0x${string}`],
        value: ethAmount,
      })
      
      toast.loading("Transaction confirming...", { id: "swap-eth" })
    } catch (err) {
      console.error("Error swapping ETH for USDC:", err)
      toast.error("Failed to swap ETH for USDC", { id: "swap-eth" })
      throw err
    }
  }

  if (isSuccess) {
    toast.success("Swap completed successfully!", { id: "swap-eth" })
  }

  const swapUSDCForETH = async ({ usdcAddress, usdcAmount }: SwapUSDCForETHParams) => {
    try {
      toast.loading("Swapping USDC for ETH...", { id: "swap-usdc" })
      
      await writeContract({
        address: process.env.NEXT_PUBLIC_SWAP_ROUTER_ADDRESS as `0x${string}`,
        abi: SWAP_ROUTER_ABI,
        functionName: "swapUSDCForETH",
        args: [usdcAddress as `0x${string}`, usdcAmount],
      })
      
      toast.loading("Transaction confirming...", { id: "swap-usdc" })
    } catch (err) {
      console.error("Error swapping USDC for ETH:", err)
      toast.error("Failed to swap USDC for ETH", { id: "swap-usdc" })
      throw err
    }
  }

  return {
    swapETHForUSDC,
    swapUSDCForETH,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}

export function useSwapQuotes() {
  const { data: exchangeRate, isLoading: isLoadingRate } = useReadContract({
    address: process.env.NEXT_PUBLIC_SWAP_ROUTER_ADDRESS as `0x${string}`,
    abi: SWAP_ROUTER_ABI,
    functionName: "getExchangeRate",
  })

  const getQuoteETHForUSDC = (ethAmount: bigint) => {
    if (!exchangeRate) return BigInt(0)
    return (ethAmount * exchangeRate[1]) / BigInt(1000000000000000000)
  }

  const getQuoteUSDCForETH = (usdcAmount: bigint) => {
    if (!exchangeRate) return BigInt(0)
    return (usdcAmount * exchangeRate[0]) / BigInt(1000000)
  }

  return {
    getQuoteETHForUSDC,
    getQuoteUSDCForETH,
    isLoadingRate,
    exchangeRate,
  }
}
