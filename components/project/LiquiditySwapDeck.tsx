"use client"

import { useState, useEffect } from "react"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import { ArrowUpDown, DollarSign, Coins, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { toast } from "react-hot-toast"

const SWAP_ABI = [
  "function swapUSDCForIPT(uint256 usdcAmount) external nonReentrant",
  "function swapIPTForUSDC(uint256 iptAmount) external nonReentrant",
  "function getQuoteUSDCForIPT(uint256 usdcAmount) public view returns (uint256)",
  "function getQuoteIPTForUSDC(uint256 iptAmount) public view returns (uint256)",
  "function getLiquidityStatus() public view returns (uint256 usdcBalance, uint256 iptBalance, uint256 currentRate)",
  "function usdcToken() public view returns (address)",
  "function iptToken() public view returns (address)"
] as const

const ERC20_ABI = [
  "function approve(address spender, uint256 amount) public returns (bool)",
  "function allowance(address owner, address spender) public view returns (uint256)",
  "function balanceOf(address account) public view returns (uint256)",
  "function decimals() public view returns (uint8)"
] as const

interface LiquiditySwapDeckProps {
  swapAddress: string
  usdcAddress: string
  iptAddress: string
}

export function LiquiditySwapDeck({ swapAddress, usdcAddress, iptAddress }: LiquiditySwapDeckProps) {
  const { address } = useAccount()
  const [swapDirection, setSwapDirection] = useState<"USDC_TO_IPT" | "IPT_TO_USDC">("USDC_TO_IPT")
  const [inputAmount, setInputAmount] = useState("")
  const [outputAmount, setOutputAmount] = useState("")

  const { data: liquidityStatus } = useReadContract({
    address: swapAddress as `0x${string}`,
    abi: SWAP_ABI,
    functionName: "getLiquidityStatus",
  })

  const { data: usdcBalance } = useReadContract({
    address: usdcAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  })

  const { data: iptBalance } = useReadContract({
    address: iptAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address as `0x${string}`] : undefined,
    query: { enabled: !!address },
  })

  const { data: usdcAllowance } = useReadContract({
    address: usdcAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address as `0x${string}`, swapAddress as `0x${string}`] : undefined,
    query: { enabled: !!address },
  })

  const { data: iptAllowance } = useReadContract({
    address: iptAddress as `0x${string}`,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address as `0x${string}`, swapAddress as `0x${string}`] : undefined,
    query: { enabled: !!address },
  })

  const { data: hash, writeContract, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Calculate output amount when input changes
  useEffect(() => {
    if (!inputAmount || !liquidityStatus) {
      setOutputAmount("")
      return
    }

    const amount = parseFloat(inputAmount)
    if (isNaN(amount) || amount <= 0) {
      setOutputAmount("")
      return
    }

    const rate = Number(liquidityStatus[2]) / 1e6
    if (swapDirection === "USDC_TO_IPT") {
      const output = amount / rate
      setOutputAmount(output.toFixed(2))
    } else {
      const output = amount * rate
      setOutputAmount(output.toFixed(2))
    }
  }, [inputAmount, swapDirection, liquidityStatus])

  const handleApprove = async () => {
    try {
      const tokenAddress = swapDirection === "USDC_TO_IPT" ? usdcAddress : iptAddress
      const amount = parseUnits(inputAmount, 6)
      
      toast.loading("Approving token spend...", { id: "approve-token" })
      await writeContract({
        address: tokenAddress as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "approve",
        args: [swapAddress as `0x${string}`, amount],
      })
      toast.loading("Transaction confirming...", { id: "approve-token" })
    } catch (error) {
      console.error("Error approving token:", error)
      toast.error("Failed to approve token", { id: "approve-token" })
    }
  }

  const handleSwap = async () => {
    try {
      const amount = parseUnits(inputAmount, 6)
      
      toast.loading("Executing swap...", { id: "execute-swap" })
      if (swapDirection === "USDC_TO_IPT") {
        await writeContract({
          address: swapAddress as `0x${string}`,
          abi: SWAP_ABI,
          functionName: "swapUSDCForIPT",
          args: [amount],
        })
      } else {
        await writeContract({
          address: swapAddress as `0x${string}`,
          abi: SWAP_ABI,
          functionName: "swapIPTForUSDC",
          args: [amount],
        })
      }
      toast.loading("Transaction confirming...", { id: "execute-swap" })
    } catch (error) {
      console.error("Error executing swap:", error)
      toast.error("Failed to execute swap", { id: "execute-swap" })
    }
  }

  if (isSuccess) {
    toast.success("Transaction completed successfully!", { id: isPending ? "approve-token" : "execute-swap" })
    setInputAmount("")
    setOutputAmount("")
  }

  const needsApproval = swapDirection === "USDC_TO_IPT" 
    ? (usdcAllowance ? BigInt(parseUnits(inputAmount || "0", 6)) > usdcAllowance : true)
    : (iptAllowance ? BigInt(parseUnits(inputAmount || "0", 6)) > iptAllowance : true)

  const userBalance = swapDirection === "USDC_TO_IPT" 
    ? (usdcBalance ? Number(usdcBalance) / 1e6 : 0)
    : (iptBalance ? Number(iptBalance) / 1e6 : 0)

  const rate = liquidityStatus ? Number(liquidityStatus[2]) / 1e6 : 1

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="h-5 w-5" />
          Secondary Market Swap
        </CardTitle>
        <CardDescription>
          Trade IPT tokens for USDC with instant liquidity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Liquidity Status */}
        {liquidityStatus && (
          <div className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4" />
              <span>Available Liquidity</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">USDC</p>
                <p className="font-semibold">{(Number(liquidityStatus[0]) / 1e6).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">IPT</p>
                <p className="font-semibold">{(Number(liquidityStatus[1]) / 1e6).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

        {/* Swap Interface */}
        <div className="space-y-4">
          {/* From Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>From</Label>
              <Badge variant="outline" className="text-xs">
                Balance: {userBalance.toLocaleString()}
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                value={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1"
              />
              <div className="flex items-center gap-2 px-4 bg-secondary rounded-lg min-w-[100px]">
                {swapDirection === "USDC_TO_IPT" ? (
                  <>
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">USDC</span>
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4" />
                    <span className="font-medium">IPT</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Swap Direction Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setSwapDirection(swapDirection === "USDC_TO_IPT" ? "IPT_TO_USDC" : "USDC_TO_IPT")
                setInputAmount("")
                setOutputAmount("")
              }}
              className="rounded-full"
            >
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          {/* To Input */}
          <div className="space-y-2">
            <Label>To (Estimated)</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={outputAmount}
                readOnly
                placeholder="0.00"
                className="flex-1 bg-muted"
              />
              <div className="flex items-center gap-2 px-4 bg-secondary rounded-lg min-w-[100px]">
                {swapDirection === "USDC_TO_IPT" ? (
                  <>
                    <Coins className="h-4 w-4" />
                    <span className="font-medium">IPT</span>
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">USDC</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Exchange Rate Info */}
          <div className="text-center text-sm text-muted-foreground">
            Rate: 1 {swapDirection === "USDC_TO_IPT" ? "USDC" : "IPT"} = {rate.toFixed(6)} {swapDirection === "USDC_TO_IPT" ? "IPT" : "USDC"}
          </div>

          {/* Action Button */}
          {address ? (
            needsApproval ? (
              <Button
                onClick={handleApprove}
                disabled={isPending || isConfirming || !inputAmount}
                className="w-full"
                variant="outline"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Approving...
                  </>
                ) : (
                  "Approve Token Spend"
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSwap}
                disabled={isPending || isConfirming || !inputAmount || parseFloat(inputAmount) <= 0}
                className="w-full"
              >
                {isPending || isConfirming ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  "Execute Swap"
                )}
              </Button>
            )
          ) : (
            <Button disabled className="w-full">
              Connect Wallet to Swap
            </Button>
          )}
        </div>

        {/* Info Box */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            <strong>Instant Liquidity:</strong> This fixed-rate swap provides immediate liquidity for your IPT tokens. The rate is set by the admin and may change over time.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
