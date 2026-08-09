"use client"

import { useState } from "react"
import { Sparkles, TrendingUp, DollarSign, Award, Shield, ShoppingCart, ChevronRight, Building2, Globe, FileText, CheckCircle } from "lucide-react"

interface CommercializableProject {
  id: string
  title: string
  description: string
  category: string
  trl: number
  ipStatus: string
  licenseType: string
  licensePrice: number
  revenueShare: number
  investors: number
  totalRaised: number
  researcher: string
  university: string
  image: string
  nftTokenId?: string
}

const projects: CommercializableProject[] = [
  {
    id: "g-cap-500",
    title: "G-Cap 500: Ultra-Fast Charging Graphene Batteries",
    description: "Revolutionary graphene-based energy storage with 5-minute charging capability. Fully validated through milestone escrow with 100% completion rate.",
    category: "Energy Storage",
    trl: 9,
    ipStatus: "IP-NFT Minted",
    licenseType: "Exclusive License",
    licensePrice: 2500000,
    revenueShare: 15,
    investors: 89,
    totalRaised: 500000,
    researcher: "Prof. Dr. Arnon Jenkins",
    university: "MIT",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/graphene-what-is-it-and-what-is-it-used-for-393831-640x360.jpg",
    nftTokenId: "#1234",
  },
  {
    id: "cnt-power-cable",
    title: "CNT Power Cable for Grid Infrastructure",
    description: "Carbon nanotube-based power transmission with 80% less energy loss. Pilot deployment completed with successful grid integration.",
    category: "Infrastructure",
    trl: 8,
    ipStatus: "IP-NFT Minted",
    licenseType: "Non-Exclusive License",
    licensePrice: 1500000,
    revenueShare: 10,
    investors: 54,
    totalRaised: 180000,
    researcher: "Dr. Somchai Tanaka",
    university: "Stanford",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/graphene-what-is-it-and-what-is-it-used-for-393831-640x360.jpg",
    nftTokenId: "#5678",
  },
  {
    id: "quantum-dots-solar",
    title: "Quantum Dot Enhanced Solar Cells",
    description: "Next-generation photovoltaic achieving 40%+ efficiency. Prototype validated with commercial partners lined up.",
    category: "Clean Energy",
    trl: 7,
    ipStatus: "Patent Pending",
    licenseType: "Exclusive License",
    licensePrice: 3000000,
    revenueShare: 12,
    investors: 156,
    totalRaised: 350000,
    researcher: "Dr. Michael Torres",
    university: "Caltech",
    image: "https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/graphene-what-is-it-and-what-is-it-used-for-393831-640x360.jpg",
    nftTokenId: "#9012",
  },
]

export default function CommercializationPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedProject, setSelectedProject] = useState<CommercializableProject | null>(null)
  const categories = ["All", "Energy Storage", "Infrastructure", "Clean Energy", "Nanomaterials"]

  const filteredProjects = selectedCategory === "All"
    ? projects
    : projects.filter(p => p.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a1a] via-[#0d1a2d] to-[#050510]">
      {/* Animated background */}
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
                <h1 className="text-3xl font-bold text-white/95">Technology Marketplace</h1>
              </div>
              <p className="text-sm text-white/60">
                License validated technologies from the MatDAO ecosystem
              </p>
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
                <Award className="h-5 w-5 text-[#6efcff]" />
              </div>
              <div>
                <p className="text-sm text-white/50">Available IPs</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#a78bfa]/10 p-3">
                <TrendingUp className="h-5 w-5 text-[#a78bfa]" />
              </div>
              <div>
                <p className="text-sm text-white/50">Avg. TRL</p>
                <p className="text-2xl font-bold text-white">8</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#6efcff]/10 p-3">
                <DollarSign className="h-5 w-5 text-[#6efcff]" />
              </div>
              <div>
                <p className="text-sm text-white/50">Total Value</p>
                <p className="text-2xl font-bold text-white">$7.0M</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-[#a78bfa]/10 p-3">
                <Shield className="h-5 w-5 text-[#a78bfa]" />
              </div>
              <div>
                <p className="text-sm text-white/50">IP-NFTs</p>
                <p className="text-2xl font-bold text-white">{projects.filter(p => p.ipStatus === "IP-NFT Minted").length}</p>
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

      {/* Projects Grid */}
      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm transition-all hover:border-[#6efcff]/30 hover:shadow-2xl hover:shadow-[#6efcff]/10"
            >
              <div className="relative h-48">
                <img
                  src={project.image}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 rounded-lg bg-black/60 backdrop-blur-sm border border-[#6efcff]/30 px-3 py-1 text-xs font-semibold text-[#c5fdff]">
                  TRL {project.trl}
                </div>
                <div className="absolute top-4 left-4 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 px-3 py-1 text-xs font-medium text-white/80">
                  {project.category}
                </div>
                {project.ipStatus === "IP-NFT Minted" && (
                  <div className="absolute bottom-4 left-4 rounded-lg bg-[#a78bfa]/20 backdrop-blur-sm border border-[#a78bfa]/30 px-3 py-1 text-xs font-semibold text-[#c5fdff] flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    IP-NFT {project.nftTokenId}
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="mb-2 text-lg font-semibold text-white/95">{project.title}</h3>
                <p className="mb-4 text-sm text-white/60 line-clamp-2">{project.description}</p>
                
                {/* License Info */}
                <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">License Type</span>
                    <span className="text-xs font-medium text-[#c5fdff]">{project.licenseType}</span>
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-white/50">License Price</span>
                    <span className="text-sm font-bold text-white">${(project.licensePrice / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/50">Revenue Share</span>
                    <span className="text-xs font-medium text-[#a78bfa]">{project.revenueShare}% to investors</span>
                  </div>
                </div>

                {/* Researcher Info */}
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#6efcff]/10 text-sm font-semibold text-[#c5fdff]">
                    {project.researcher.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/90">{project.researcher}</p>
                    <p className="text-xs text-white/50">{project.university}</p>
                  </div>
                </div>

                {/* Validation Badge */}
                <div className="mb-4 rounded-lg border border-green-500/30 bg-green-500/10 p-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-xs text-green-400">Fully validated through milestone escrow</span>
                </div>

                <button className="group w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6efcff] to-[#a78bfa] px-4 py-3 text-sm font-semibold text-black transition-all hover:opacity-90">
                  <DollarSign className="h-4 w-4" />
                  Purchase License
                  <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#6efcff]/30 bg-[#6efcff]/10 mb-4">
                <Shield className="h-6 w-6 text-[#c5fdff]" />
              </div>
              <h3 className="text-lg font-semibold text-white/95 mb-2">IP Protection</h3>
              <p className="text-sm text-white/60">
                All technologies are protected through IP-NFTs on-chain, ensuring immutable proof of ownership and licensing rights.
              </p>
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#a78bfa]/30 bg-[#a78bfa]/10 mb-4">
                <Building2 className="h-6 w-6 text-[#a78bfa]" />
              </div>
              <h3 className="text-lg font-semibold text-white/95 mb-2">OEM Integration</h3>
              <p className="text-sm text-white/60">
                Streamlined licensing process for OEMs and industry partners to integrate validated technologies into their products.
              </p>
            </div>
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#6efcff]/30 bg-[#6efcff]/10 mb-4">
                <DollarSign className="h-6 w-6 text-[#6efcff]" />
              </div>
              <h3 className="text-lg font-semibold text-white/95 mb-2">Revenue Splitting</h3>
              <p className="text-sm text-white/60">
                Smart contract-based revenue splitting automatically distributes licensing fees to original investors and researchers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
