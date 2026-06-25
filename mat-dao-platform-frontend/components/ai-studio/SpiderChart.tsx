"use client"

import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts"

interface SpiderChartProps {
  data: Array<{
    name: string
    score: number
    maxScore: number
  }>
}

export function SpiderChart({ data }: SpiderChartProps) {
  const chartData = data.map((item) => ({
    dimension: item.name,
    score: (item.score / item.maxScore) * 100,
  }))

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={chartData}>
          <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: "rgba(255, 255, 255, 0.7)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "rgba(255, 255, 255, 0.5)", fontSize: 10 }}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#6efcff"
            fill="#6efcff"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}
