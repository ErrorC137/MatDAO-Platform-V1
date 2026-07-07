"use client"

import { useState } from "react"
import { PartnersCarousel } from "@/components/partners-carousel"
import { Wallet, Send } from "lucide-react"

interface ProjectDetailClientProps {
  project: {
    title: string
    phase: string
    researcher: string
    funding: number
    trl: number
    isRaising?: boolean
    raisedAmount?: number
    targetAmount?: number
    investors?: number
    daysRemaining?: number
  }
}

export function ProjectDetailClient({ project }: ProjectDetailClientProps) {
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [showInvestModal, setShowInvestModal] = useState(false)
  const [investAmount, setInvestAmount] = useState("")
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")

  const handleConnectWallet = () => {
    // Demo wallet connection
    setWalletAddress("0x1234...5678")
    setWalletConnected(true)
    setShowWalletModal(false)
  }

  const handleInvest = () => {
    // Demo investment
    alert(`Investment of $${investAmount} sent successfully! (Demo)`)
    setShowInvestModal(false)
    setInvestAmount("")
  }

  return (
    <>
      {/* Action Bar */}
      <div className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors">
                Overview
              </button>
              <button className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors">
                Team
              </button>
              <button className="rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10 transition-colors">
                Documents
              </button>
            </div>
            <div className="flex items-center gap-3">
              {walletConnected ? (
                <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2">
                  <Wallet className="h-4 w-4 text-green-400" />
                  <span className="text-sm text-green-400">{walletAddress}</span>
                </div>
              ) : (
                <button
                  onClick={() => setShowWalletModal(true)}
                  className="flex items-center gap-2 rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/10 px-4 py-2 text-sm text-[#c5fdff] hover:bg-[#6efcff]/20 transition-colors"
                >
                  <Wallet className="h-4 w-4" />
                  Connect Wallet
                </button>
              )}
              {project.isRaising && (
                <button
                  onClick={() => setShowInvestModal(true)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-r from-[#6efcff] to-[#a78bfa] px-6 py-2 text-sm font-semibold text-black hover:opacity-90 transition-opacity"
                >
                  <Send className="h-4 w-4" />
                  Invest Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showWalletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/90 p-6">
            <h3 className="mb-4 text-xl font-bold text-white">Connect Wallet</h3>
            <p className="mb-6 text-sm text-white/70">Connect your wallet to invest in this project</p>
            <div className="space-y-3">
              <button
                onClick={handleConnectWallet}
                className="w-full rounded-lg border border-[#6efcff]/30 bg-[#6efcff]/10 px-4 py-3 text-sm font-medium text-[#c5fdff] hover:bg-[#6efcff]/20 transition-colors"
              >
                MetaMask
              </button>
              <button
                onClick={handleConnectWallet}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                WalletConnect
              </button>
              <button
                onClick={() => setShowWalletModal(false)}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showInvestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/20 bg-black/90 p-6">
            <h3 className="mb-4 text-xl font-bold text-white">Invest in {project.title}</h3>
            <div className="mb-4">
              <label className="mb-2 block text-sm text-white/70">Investment Amount (USD)</label>
              <input
                type="number"
                value={investAmount}
                onChange={(e) => setInvestAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-white placeholder:text-white/30"
              />
            </div>
            <div className="mb-6 rounded-lg border border-white/20 bg-white/5 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Project</span>
                <span className="text-white">{project.title}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-white/70">Your Investment</span>
                <span className="text-[#c5fdff]">${investAmount || '0'}</span>
              </div>
            </div>
            <div className="space-y-3">
              <button
                onClick={handleInvest}
                disabled={!investAmount || !walletConnected}
                className="w-full rounded-full bg-gradient-to-r from-[#6efcff] to-[#a78bfa] px-4 py-3 text-sm font-semibold text-black hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Confirm Investment
              </button>
              <button
                onClick={() => setShowInvestModal(false)}
                className="w-full rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-sm font-medium text-white/80 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partners Carousel */}
      <PartnersCarousel />
    </>
  )
}
