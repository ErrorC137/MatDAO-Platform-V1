"use client"

import { useState } from "react"
import { Clock, TrendingUp, Target, DollarSign, Calendar, Users } from "lucide-react"

interface FundraisingCampaign {
  id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  endDate: string
  category: string
  backers: number
  image: string
  researcher: string
  trl: number
}

const campaigns: FundraisingCampaign[] = [
  {
    id: "water-hyacinth-biochar",
    title: "Water Hyacinth Biochar for Carbon Sequestration",
    description: "Transform invasive water hyacinth into high-value biochar for carbon capture and soil enhancement. This sustainable approach addresses ecological invasion while creating economic value through carbon credits.",
    targetAmount: 250000,
    currentAmount: 175000,
    endDate: "2026-07-20",
    category: "Environmental Tech",
    backers: 127,
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/graphene-what-is-it-and-what-is-it-used-for-393831-640x360.jpg",
    researcher: "Dr. Sarah Chen",
    trl: 7,
  },
  {
    id: "g-cap-500",
    title: "G-Cap 500: Ultra-Fast Charging Graphene Batteries",
    description: "Revolutionary graphene-based energy storage with 5-minute charging capability. Targeting electric vehicle and data center markets with 10x faster charging than conventional Li-ion batteries.",
    targetAmount: 500000,
    currentAmount: 320000,
    endDate: "2026-07-20",
    category: "Energy Storage",
    backers: 89,
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/graphene-what-is-it-and-what-is-it-used-for-393831-640x360.jpg",
    researcher: "Prof. Dr. Arnon Jenkins",
    trl: 6,
  },
  {
    id: "cnt-power-cable",
    title: "CNT Power Cable for Grid Infrastructure",
    description: "Carbon nanotube-based power transmission cables with 80% less energy loss than traditional copper. Enabling efficient long-distance power transmission for renewable energy integration.",
    targetAmount: 180000,
    currentAmount: 95000,
    endDate: "2026-07-20",
    category: "Infrastructure",
    backers: 54,
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/graphene-what-is-it-and-what-is-it-used-for-393831-640x360.jpg",
    researcher: "Dr. Somchai Tanaka",
    trl: 4,
  },
  {
    id: "quantum-dots-solar",
    title: "Quantum Dot Enhanced Solar Cells",
    description: "Next-generation photovoltaic technology using quantum dots to achieve 40%+ efficiency. Breaking the Shockley-Queisser limit for commercial solar applications.",
    targetAmount: 350000,
    currentAmount: 125000,
    endDate: "2026-08-15",
    category: "Clean Energy",
    backers: 156,
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/graphene-what-is-it-and-what-is-it-used-for-393831-640x360.jpg",
    researcher: "Dr. Michael Torres",
    trl: 5,
  },
]

export default function FundraisingPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const categories = ["All", "Environmental Tech", "Energy Storage", "Infrastructure", "Clean Energy"]

  const filteredCampaigns = selectedCategory === "All" 
    ? campaigns 
    : campaigns.filter(c => c.category === selectedCategory)

  const getTimeRemaining = (endDate: string) => {
    const end = new Date(endDate)
    const now = new Date()
    const diff = end.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} days remaining` : "Campaign ended"
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/60 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Active Fundraising</h1>
              <p className="mt-2 text-muted-foreground">
                Support breakthrough material science projects with time-limited funding campaigns
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/20 px-4 py-2">
                <Clock className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">
                  Campaigns end July 20, 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold text-foreground">$715,000</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Campaigns</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Backers</p>
                <p className="text-2xl font-bold text-foreground">426</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-3">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Contribution</p>
                <p className="text-2xl font-bold text-foreground">$1,678</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary/20 text-foreground hover:bg-secondary/30"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="overflow-hidden rounded-xl border border-border/60 bg-card transition-all hover:shadow-lg"
            >
              <div className="relative h-48">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-4 right-4 rounded-lg bg-primary/90 px-3 py-1 text-xs font-semibold text-primary-foreground">
                  TRL {campaign.trl}
                </div>
              </div>
              <div className="p-6">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {campaign.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {getTimeRemaining(campaign.endDate)}
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{campaign.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">${campaign.currentAmount.toLocaleString()} raised</span>
                    <span className="font-medium text-foreground">
                      {getProgressPercentage(campaign.currentAmount, campaign.targetAmount).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary/20">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${getProgressPercentage(campaign.currentAmount, campaign.targetAmount)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Goal: ${campaign.targetAmount.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-border/60 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {campaign.researcher.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-xs text-muted-foreground">{campaign.researcher}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {campaign.backers} backers
                  </div>
                </div>
                <button className="mt-4 w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                  Fund Project
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
