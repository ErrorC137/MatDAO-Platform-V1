"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { AlertTriangle, Shield, DollarSign, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"

const ESCROW_ABI = [
  "function toggleProjectFailure() external onlyOwner",
  "function claimEmergencyRefund() external nonReentrant",
  "function getEmergencyRefundEstimate(address user) public view returns (uint256)",
  "function isProjectFailed() public view returns (bool)",
  "function fundingToken() public view returns (address)"
] as const

interface RiskManagementPanelProps {
  escrowAddress: string
  isAdmin?: boolean
}

export function RiskManagementPanel({ escrowAddress, isAdmin = false }: RiskManagementPanelProps) {
  const { address } = useAccount()
  const { data: isProjectFailed } = useReadContract({
    address: escrowAddress as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: "isProjectFailed",
  })
  
  const { data: refundEstimate } = useReadContract({
    address: escrowAddress as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: "getEmergencyRefundEstimate",
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address && isProjectFailed },
  })

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleToggleFailure = async () => {
    try {
      toast.loading("Declaring project failure...", { id: "toggle-failure" })
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "toggleProjectFailure",
      })
      toast.loading("Transaction confirming...", { id: "toggle-failure" })
    } catch (error) {
      console.error("Error toggling project failure:", error)
      toast.error("Failed to declare project failure", { id: "toggle-failure" })
    }
  }

  const handleClaimRefund = async () => {
    try {
      toast.loading("Claiming emergency refund...", { id: "claim-refund" })
      await writeContract({
        address: escrowAddress as `0x${string}`,
        abi: ESCROW_ABI,
        functionName: "claimEmergencyRefund",
      })
      toast.loading("Transaction confirming...", { id: "claim-refund" })
    } catch (error) {
      console.error("Error claiming refund:", error)
      toast.error("Failed to claim refund", { id: "claim-refund" })
    }
  }

  if (isSuccess) {
    toast.success("Transaction completed successfully!", { id: isPending ? "toggle-failure" : "claim-refund" })
  }

  const refundAmount = refundEstimate ? Number(refundEstimate) / 1e6 : 0

  if (!isProjectFailed && !isAdmin) {
    return null
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Risk Management
        </CardTitle>
        <CardDescription>
          Emergency refund mechanism for failed projects
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isProjectFailed ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div className="flex-1">
                <p className="font-semibold text-red-900 dark:text-red-100">Project Failed</p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Emergency refund mechanism is now active
                </p>
              </div>
              <Badge variant="destructive">Emergency Mode</Badge>
            </div>

            {address && refundEstimate !== undefined && refundEstimate > 0n && (
              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-900 dark:text-blue-100">Your Refund Estimate</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <span className="font-bold text-blue-900 dark:text-blue-100">
                      {refundAmount.toLocaleString()} USDC
                    </span>
                  </div>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  Proportional share of remaining escrow funds
                </p>
              </div>
            )}

            {address && (
              <Button
                onClick={handleClaimRefund}
                disabled={isPending || isConfirming || !refundEstimate || refundEstimate === 0n}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Claim Proportional Refund"
                )}
              </Button>
            )}
          </div>
        ) : (
          isAdmin && (
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-900 dark:text-yellow-100">
                      Emergency Refund Activation
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      This will activate the emergency refund mechanism, allowing investors to burn their IPT tokens and claim a proportional share of remaining escrow funds. This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleToggleFailure}
                disabled={isPending || isConfirming}
                variant="destructive"
                className="w-full"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Declare Project Failure"
                )}
              </Button>
            </div>
          )
        )}
      </CardContent>
    </Card>
  )
}
