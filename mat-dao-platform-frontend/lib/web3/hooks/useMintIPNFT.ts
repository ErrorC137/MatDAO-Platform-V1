"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import toast from "react-hot-toast"

const MATDAO_IPNFT_ABI = [
  "function mintIP(address researcher, string _tokenURI) public onlyOwner returns (uint256)",
  "event IPNFTMinted(uint256 indexed tokenId, address indexed researcher, string tokenURI)"
] as const

interface MintIPNFTParams {
  researcher: string
  tokenURI: string
  contractAddress: string
}

export function useMintIPNFT() {
  const { data: hash, writeContract, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const mintIPNFT = async ({ researcher, tokenURI, contractAddress }: MintIPNFTParams) => {
    try {
      toast.loading("Initiating IP-NFT mint...", { id: "mint-ipnft" })
      
      await writeContract({
        address: contractAddress as `0x${string}`,
        abi: MATDAO_IPNFT_ABI,
        functionName: "mintIP",
        args: [researcher as `0x${string}`, tokenURI],
      })
      
      toast.loading("Transaction confirming...", { id: "mint-ipnft" })
    } catch (err) {
      console.error("Error minting IP-NFT:", err)
      toast.error("Failed to mint IP-NFT", { id: "mint-ipnft" })
      throw err
    }
  }

  // Show success toast when transaction confirms
  if (isSuccess) {
    toast.success("IP-NFT minted successfully!", { id: "mint-ipnft" })
  }

  return {
    mintIPNFT,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    hash,
  }
}
