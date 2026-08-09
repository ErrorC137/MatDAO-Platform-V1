"use client"

import { BookOpen, Gem, Wallet, FileText, Shield, Target, Layers } from "lucide-react"
import Link from "next/link"

export default function GuidePage() {
  return (
    <div className="relative px-5 py-12 sm:px-6 md:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/16 via-black/26 to-black/56" />
        <div className="absolute left-1/2 top-[-10%] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-300/3 blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl">
        <div className="mb-10 text-center md:mb-14">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#6efcff]/35 bg-[#6efcff]/10 px-4 py-1 text-[11px] uppercase tracking-[0.18em] text-[#c5fdff]">
            <BookOpen className="h-3.5 w-3.5" />
            User Guide
          </p>
          <h1 className="font-headline mb-3 text-4xl font-extrabold tracking-tight text-white/95 md:text-5xl">
            How to Use MatDAO Platform
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/70 md:text-lg">
            Complete guide to using all features including IP-NFT minting, AI analysis, and wallet integration.
          </p>
        </div>

        <div className="space-y-6">
          {/* IP-NFT Minting */}
          <section className="workflow-panel rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#f59e0b]/25 bg-[#f59e0b]/10">
                <Gem className="h-5 w-5 text-[#f59e0b]" />
              </div>
              <h2 className="font-headline text-xl font-bold text-white/95">IP-NFT Minting</h2>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <p><strong className="text-white/90">What is IP-NFT?</strong></p>
              <p className="ml-4">IP-NFTs (Intellectual Property Non-Fungible Tokens) represent validated research on the blockchain. They provide permanent, tamper-proof proof of your research assessment and can be traded or used as collateral.</p>
              
              <p className="mt-4"><strong className="text-white/90">How to Mint:</strong></p>
              <ol className="ml-4 list-decimal space-y-2">
                <li>Complete a <Link href="/ai-studio/project-assessment" className="text-[#c5fdff] underline">Unified AI Analysis</Link> of your research</li>
                <li>Review the detailed assessment report</li>
                <li>Connect your wallet (MetaMask, WalletConnect, etc.)</li>
                <li>Click "Mint IP-NFT" button on the results page</li>
                <li>Confirm the transaction in your wallet</li>
                <li>Your IP-NFT will be minted with the assessment metadata stored on IPFS</li>
              </ol>
              
              <p className="mt-4"><strong className="text-white/90">Benefits:</strong></p>
              <ul className="ml-4 list-disc space-y-1">
                <li>Permanent blockchain record of your research validation</li>
                <li>Tradeable asset with embedded AI assessment scores</li>
                <li>Access to MatDAO funding and collaboration opportunities</li>
                <li>Proof of scientific integrity and novelty</li>
              </ul>
            </div>
          </section>

          {/* Wallet Connection */}
          <section className="workflow-panel rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6efcff]/25 bg-[#6efcff]/10">
                <Wallet className="h-5 w-5 text-[#6efcff]" />
              </div>
              <h2 className="font-headline text-xl font-bold text-white/95">Wallet Connection</h2>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <p><strong className="text-white/90">Supported Wallets:</strong></p>
              <ul className="ml-4 list-disc space-y-1">
                <li>MetaMask</li>
                <li>WalletConnect</li>
                <li> Coinbase Wallet</li>
                <li>Other EVM-compatible wallets</li>
              </ul>
              
              <p className="mt-4"><strong className="text-white/90">How to Connect:</strong></p>
              <ol className="ml-4 list-decimal space-y-2">
                <li>Click "Connect Wallet" in the top navigation bar</li>
                <li>Select your preferred wallet from the popup</li>
                <li>Approve the connection request in your wallet</li>
                <li>Your wallet address will be displayed in the header</li>
              </ol>
              
              <p className="mt-4"><strong className="text-white/90">Network:</strong></p>
              <p className="ml-4">Make sure your wallet is connected to the Sepolia testnet for development, or Ethereum mainnet for production.</p>
            </div>
          </section>

          {/* AI Analysis Tools */}
          <section className="workflow-panel rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6efcff]/25 bg-[#6efcff]/10">
                <Layers className="h-5 w-5 text-[#6efcff]" />
              </div>
              <h2 className="font-headline text-xl font-bold text-white/95">AI Analysis Tools</h2>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <p><strong className="text-white/90">Unified AI Analysis:</strong></p>
              <p className="ml-4">Run all three analyses (TRL, IP Valuation, Due Diligence) in a single upload for comprehensive research intelligence.</p>
              
              <p className="mt-4"><strong className="text-white/90">Individual Tools:</strong></p>
              <ul className="ml-4 list-disc space-y-1">
                <li><strong className="text-white/90">TRL Evaluation:</strong> NASA/EU scale classification with commercialization roadmap</li>
                <li><strong className="text-white/90">IP Valuation:</strong> Automated patent classification, originality scoring, FTO analysis</li>
                <li><strong className="text-white/90">Due Diligence:</strong> 9-dimension scientific scoring with integrity gates</li>
              </ul>
              
              <p className="mt-4"><strong className="text-white/90">How to Use:</strong></p>
              <ol className="ml-4 list-decimal space-y-2">
                <li>Navigate to <Link href="/ai-studio" className="text-[#c5fdff] underline">AI Studio</Link></li>
                <li>Choose Unified Analysis or individual tool</li>
                <li>Upload your research document (PDF, DOCX, or text)</li>
                <li>Fill in project details (title, author, category)</li>
                <li>Submit for analysis</li>
                <li>Review detailed results and download PDF report</li>
              </ol>
            </div>
          </section>

          {/* Profile & Milestones */}
          <section className="workflow-panel rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6efcff]/25 bg-[#6efcff]/10">
                <FileText className="h-5 w-5 text-[#6efcff]" />
              </div>
              <h2 className="font-headline text-xl font-bold text-white/95">Profile & Milestones</h2>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <p><strong className="text-white/90">Researcher Profile:</strong></p>
              <p className="ml-4">Your profile stores your research assessments, submitted milestones, and IP-NFTs. Access it via the profile menu in the navigation.</p>
              
              <p className="mt-4"><strong className="text-white/90">Milestone Tracking:</strong></p>
              <p className="ml-4">Track your research progress through TRL milestones. Submit milestone proofs via the AI Auditor for validation.</p>
              
              <p className="mt-4"><strong className="text-white/90">Saving Assessments:</strong></p>
              <p className="ml-4">Click "Save to Profile" on assessment results to store them in your profile for future reference.</p>
            </div>
          </section>

          {/* Getting Started */}
          <section className="workflow-panel rounded-2xl p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#6efcff]/25 bg-[#6efcff]/10">
                <Target className="h-5 w-5 text-[#6efcff]" />
              </div>
              <h2 className="font-headline text-xl font-bold text-white/95">Getting Started</h2>
            </div>
            <div className="space-y-3 text-sm text-white/70">
              <p><strong className="text-white/90">Quick Start:</strong></p>
              <ol className="ml-4 list-decimal space-y-2">
                <li><Link href="/auth/sign-up" className="text-[#c5fdff] underline">Create an account</Link> or sign in</li>
                <li>Connect your wallet (optional but recommended for IP-NFT minting)</li>
                <li>Go to <Link href="/ai-studio" className="text-[#c5fdff] underline">AI Studio</Link> and run your first analysis</li>
                <li>Mint your first IP-NFT to validate your research on-chain</li>
                <li>Explore <Link href="/co-founder-match" className="text-[#c5fdff] underline">Co-founder Match</Link> and <Link href="/fundraising" className="text-[#c5fdff] underline">Fundraising</Link> features</li>
              </ol>
              
              <p className="mt-4"><strong className="text-white/90">Need Help?</strong></p>
              <p className="ml-4">Contact support or check our documentation for more detailed guides.</p>
            </div>
          </section>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 px-6 py-5 text-center">
          <p className="text-xs text-white/50">
            Ready to start? <Link href="/ai-studio" className="text-[#c5fdff] underline">Go to AI Studio</Link> or <Link href="/auth/sign-up" className="text-[#c5fdff] underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
