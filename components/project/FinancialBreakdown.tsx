"use client"

import { useReadContract } from "wagmi"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { DollarSign, TrendingUp, PiggyBank, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const ESCROW_ABI = [
  "function getFinancialBreakdown() public view returns (uint256 totalGoal, uint256 platformFee, uint256 netRunway)"
] as const

interface FinancialBreakdownProps {
  escrowAddress: string
}

const COLORS = {
  platform: "#ef4444",
  research: "#10b981",
  remaining: "#3b82f6"
}

export function FinancialBreakdown({ escrowAddress }: FinancialBreakdownProps) {
  const { data: breakdown } = useReadContract({
    address: escrowAddress as `0x${string}`,
    abi: ESCROW_ABI,
    functionName: "getFinancialBreakdown",
  })

  if (!breakdown) {
    return null
  }

  const [totalGoal, platformFee, netRunway] = breakdown
  const total = Number(totalGoal) / 1e6
  const fee = Number(platformFee) / 1e6
  const runway = Number(netRunway) / 1e6
  const feePercentage = ((fee / total) * 100).toFixed(1)

  const data = [
    { name: "MatDAO Platform Fee", value: fee, color: COLORS.platform },
    { name: "Research Runway", value: runway, color: COLORS.research }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Financial Breakdown
        </CardTitle>
        <CardDescription>
          Transparent fee structure and research funding allocation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-blue-900 dark:text-blue-100">Total Goal</span>
            </div>
            <p className="text-xl font-bold text-blue-900 dark:text-blue-100">
              ${total.toLocaleString()}
            </p>
          </div>

          <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <PiggyBank className="h-4 w-4 text-red-600 dark:text-red-400" />
              <span className="text-xs text-red-900 dark:text-red-100">Platform Fee</span>
            </div>
            <p className="text-xl font-bold text-red-900 dark:text-red-100">
              ${fee.toLocaleString()}
            </p>
            <Badge variant="secondary" className="mt-1 bg-red-100 text-red-800">
              {feePercentage}%
            </Badge>
          </div>

          <div className="p-4 bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs text-emerald-900 dark:text-emerald-100">Net Runway</span>
            </div>
            <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100">
              ${runway.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-4 bg-secondary/20 border border-border/60 rounded-lg">
          <Info className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">
              MatDAO Success Fee
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A 2.5% platform fee is collected when the funding goal is reached. This fee supports MatDAO's operations and platform development. The remaining 97.5% goes directly to the researcher for milestone-based funding.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
