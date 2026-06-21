"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { Building2, TrendingUp, DollarSign, Loader2, ArrowDownRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"

const ESCROW_ABI = [
  "function depositRoyalties(uint256 amount) external nonReentrant",
  "function claimDividends() external nonReentrant",
  "function getClaimableDividends(address user) public view returns (uint256)",
  "function totalDividendPool() public view returns (uint256)",
  "function fundingToken() public view returns (address)"
] as const

interface RoyaltySimulationPanelProps {
  escrowAddress: string
}

export function RoyaltySimulationPanel({ escrowAddress }: RoyaltySimulationPanelProps) {
  const { address } = useAccount()
  const [royaltyAmount, setRoyaltyAmount] = useState(10000)
  
  const { data: totalDividendPool } = useReadContract({
    address: escrowAddress as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: "totalDividendPool",
  })
  
  const { data: claimableDividends } = useReadContract({
    address: escrowAddress as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: "getClaimableDividends",
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  })

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleDepositRoyalties = async () => {
    try {
      toast.loading("Depositing royalties...", { id: "deposit-royalties" })
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "depositRoyalties",
        args: [parseUnits(royaltyAmount.toString(), 6)],
      })
      toast.loading("Transaction confirming...", { id: "deposit-royalties" })
    } catch (error) {
      console.error("Error depositing royalties:", error)
      toast.error("Failed to deposit royalties", { id: "deposit-royalties" })
    }
  }

  const handleClaimDividends = async () => {
    try {
      toast.loading("Claiming dividends...", { id: "claim-dividends" })
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "claimDividends",
      })
      toast.loading("Transaction confirming...", { id: "claim-dividends" })
    } catch (error) {
      console.error("Error claiming dividends:", error)
      toast.error("Failed to claim dividends", { id: "claim-dividends" })
    }
  }

  if (isSuccess) {
    toast.success("Transaction completed successfully!", { id: isPending ? "deposit-royalties" : "claim-dividends" })
  }

  // Calculate royalty splits
  const daoFee = (royaltyAmount * 10) / 100
  const researcherFee = (royaltyAmount * 30) / 100
  const investorPool = royaltyAmount - daoFee - researcherFee

  const totalPool = totalDividendPool ? Number(totalDividendPool) / 1e6 : 0
  const claimable = claimableDividends ? Number(claimableDividends) / 1e6 : 0

  return (
    <div className="space-y-4">
      {/* Enterprise Portal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Enterprise Portal
          </CardTitle>
          <CardDescription>
            Simulate enterprise licensing royalty payments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="royalty-amount">Licensing Amount (USDC)</Label>
            <Input
              id="royalty-amount"
              type="number"
              value={royaltyAmount}
              onChange={(e) => setRoyaltyAmount(Number(e.target.value))}
              placeholder="Enter amount"
            />
          </div>

          <div className="grid grid-cols-3 gap-4 p-4 bg-secondary/20 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">MatDAO (10%)</p>
              <p className="font-semibold text-primary">${daoFee.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Researcher (30%)</p>
              <p className="font-semibold text-emerald-600">${researcherFee.toLocaleString()}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">IPT Holders (60%)</p>
              <p className="font-semibold text-blue-600">${investorPool.toLocaleString()}</p>
            </div>
          </div>

          <Button
            onClick={handleDepositRoyalties}
            disabled={isPending || isConfirming}
            className="w-full"
          >
            {isPending || isConfirming ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ArrowDownRight className="mr-2 h-4 w-4" />
                Simulate Enterprise Payment
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Dividend Pool Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Dividend Pool
          </CardTitle>
          <CardDescription>
            Royalty dividends for IPT token holders
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div>
              <p className="text-sm text-blue-900 dark:text-blue-100">Total Dividend Pool</p>
              <p className="text-xs text-blue-700 dark:text-blue-300">Available for IPT holders</p>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {totalPool.toLocaleString()}
              </span>
              <span className="text-sm text-blue-600 dark:text-blue-400">USDC</span>
            </div>
          </div>

          {address && (
            <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
              <div>
                <p className="text-sm text-emerald-900 dark:text-emerald-100">Your Claimable Dividends</p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">Based on your IPT holdings</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <DollarSign className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    {claimable.toLocaleString()}
                  </span>
                  <span className="text-sm text-emerald-600 dark:text-emerald-400">USDC</span>
                </div>
                {claimable > 0 && (
                  <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                    Available
                  </Badge>
                )}
              </div>
            </div>
          )}

          {address && (
            <Button
              onClick={handleClaimDividends}
              disabled={isPending || isConfirming || claimable === 0}
              className="w-full"
              variant={claimable > 0 ? "default" : "outline"}
            >
              {isPending || isConfirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Claim Dividends
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
