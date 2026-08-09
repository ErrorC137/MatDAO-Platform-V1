"use client"

import { useState } from "react"
import { Clock, TrendingUp, Target, DollarSign, Calendar, Users, Wallet, Sparkles, ChevronRight, Shield, Zap } from "lucide-react"

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
  vaultAddress?: string
  acceptedCurrencies?: string[]
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
    vaultAddress: "0x1234...5678",
    acceptedCurrencies: ["USDC", "USDT", "ETH"],
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
    vaultAddress: "0xabcd...efgh",
    acceptedCurrencies: ["USDC", "USDT"],
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
    vaultAddress: "0x9876...5432",
    acceptedCurrencies: ["USDC"],
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
    vaultAddress: "0xfedc...ba98",
    acceptedCurrencies: ["USDC", "USDT", "ETH"],
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
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d1a2d] to-[#050510]">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6efcff]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#a78bfa]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6efcff]/30 bg-[#6efcff]/10">
                  <Sparkles className="h-5 w-5 text-[#c5fdff]" />
                </div>
                <h1 className="text-3xl font-bold text-white/95">Active Fundraising</h1>
              </div>
              <p className="text-sm text-white/60">
                Support breakthrough material science projects with secure funding
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 rounded-xl border border-[#6efcff]/30 bg-[#6efcff]/10 px-4 py-2">
                <Clock className="h-4 w-4 text-[#c5fdff]" />
                <span className="text-sm font-medium text-white">
                  Campaigns end July 20, 2026
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#6efcff]/10 p-3">
                <TrendingUp className="h-5 w-5 text-[#6efcff]" />
              </div>
              <div>
                <p className="text-sm text-white/50">Total Raised</p>
                <p className="text-2xl font-bold text-white">$715,000</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#a78bfa]/10 p-3">
                <Target className="h-5 w-5 text-[#a78bfa]" />
              </div>
              <div>
                <p className="text-sm text-white/50">Active Campaigns</p>
                <p className="text-2xl font-bold text-white">4</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#6efcff]/10 p-3">
                <Users className="h-5 w-5 text-[#6efcff]" />
              </div>
              <div>
                <p className="text-sm text-white/50">Total Backers</p>
                <p className="text-2xl font-bold text-white">426</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#a78bfa]/10 p-3">
                <DollarSign className="h-5 w-5 text-[#a78bfa]" />
              </div>
              <div>
                <p className="text-sm text-white/50">Avg. Contribution</p>
                <p className="text-2xl font-bold text-white">$1,678</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-gradient-to-r from-[#6efcff] to-[#a78bfa] text-black"
                  : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white/80"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all hover:border-[#6efcff]/30 hover:shadow-2xl hover:shadow-[#6efcff]/10"
            >
              <div className="relative h-48">
                <img
                  src={campaign.image}
                  alt={campaign.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 rounded-lg bg-black/60 backdrop-blur-sm border border-[#6efcff]/30 px-3 py-1 text-xs font-semibold text-[#c5fdff]">
                  TRL {campaign.trl}
                </div>
                <div className="absolute top-4 left-4 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  {campaign.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-white/95">{campaign.title}</h3>
                <p className="mb-4 text-sm text-white/60 line-clamp-2">{campaign.description}</p>
                
                {/* Vault Info - Simplified for Web2 users */}
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-[#6efcff]" />
                    <span className="text-xs text-white/50">Secure Funding Vault</span>
                  </div>
                  <p className="text-xs font-mono text-[#c5fdff]">{campaign.vaultAddress}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Zap className="h-3 w-3 text-[#a78bfa]" />
                    <span className="text-xs text-white/50">
                      Accepts: {campaign.acceptedCurrencies?.join(", ")}
                    </span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-white/60">${campaign.currentAmount.toLocaleString()} raised</span>
                    <span className="font-medium text-[#c5fdff]">
                      {getProgressPercentage(campaign.currentAmount, campaign.targetAmount).toFixed(0)}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6efcff] to-[#a78bfa] transition-all"
                      style={{
                        width: `${getProgressPercentage(campaign.currentAmount, campaign.targetAmount)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-white/50">
                    Goal: ${campaign.targetAmount.toLocaleString()}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6efcff]/10 text-xs font-semibold text-[#c5fdff]">
                      {campaign.researcher.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-xs text-white/60">{campaign.researcher}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-white/50">
                    <Clock className="h-3 w-3" />
                    {getTimeRemaining(campaign.endDate)}
                  </div>
                </div>

                <button className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6efcff] to-[#a78bfa] px-4 py-3 text-sm font-semibold text-black transition-all hover:opacity-90">
                  <DollarSign className="h-4 w-4" />
                  Fund Project
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
