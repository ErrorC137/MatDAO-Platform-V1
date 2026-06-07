import { Coins, Vote, ShieldCheck, TrendingUp } from "lucide-react"

const tokenFeatures = [
  {
    icon: Vote,
    title: "Governance Voting",
    description:
      "Token holders will participate in decentralized governance, voting on platform direction, project funding, and milestone approval.",
  },
  {
    icon: ShieldCheck,
    title: "Staking & Verification",
    description:
      "Stake MatTokens to become a verified reviewer. Earn rewards for helping validate milestone submissions.",
  },
  {
    icon: TrendingUp,
    title: "Funding Pools",
    description:
      "MatTokens will power funding pools for research projects. Contribute to pools aligned with your investment thesis.",
  },
  {
    icon: Coins,
    title: "Reward Distribution",
    description:
      "Researchers and reviewers earn MatTokens for successful milestone completions and quality reviews.",
  },
]

const roadmapItems = [
  {
    quarter: "Q1 2026",
    title: "MVP Launch",
    description:
      "Platform launch with structured project submissions and milestone tracking. No token functionality yet.",
    status: "current",
  },
  {
    quarter: "Q2 2026",
    title: "Wallet Integration",
    description:
      "Connect wallet functionality for user identity. Wallet addresses stored for future token distribution.",
    status: "next",
  },
  {
    quarter: "Q3 2026",
    title: "Token Generation Event",
    description:
      "MatToken deployed on-chain. Initial distribution to early platform participants and researchers.",
    status: "future",
  },
  {
    quarter: "Q4 2026",
    title: "Full DAO Governance",
    description:
      "Decentralized governance goes live. Token holders vote on platform upgrades and funding decisions.",
    status: "future",
  },
]

export default function MatTokenPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center gap-6 border-b border-border/40 px-4 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Coins className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
          MatToken
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          The future governance and utility token powering the MatDAO ecosystem.
          MatToken is not yet live -- this page outlines the planned token
          economy.
        </p>
        <div className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent">
          Coming Soon
        </div>
      </section>

      {/* Token Utility */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Planned Token Utility
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {tokenFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-border/60 bg-card p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <feature.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Token Roadmap */}
      <section className="border-t border-border/40 bg-secondary/20 py-20">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Token Roadmap
          </h2>
          <div className="flex flex-col gap-8">
            {roadmapItems.map((item, index) => (
              <div key={item.quarter} className="flex items-start gap-6">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      item.status === "current"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < roadmapItems.length - 1 && (
                    <div className="mt-2 h-16 w-px bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-2">
                  <span className="text-sm font-medium text-primary">
                    {item.quarter}
                  </span>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="px-4 py-12">
        <div className="mx-auto max-w-3xl rounded-xl border border-border/60 bg-card p-6 text-center">
          <p className="text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Disclaimer:</span>{" "}
            MatToken is a planned feature and does not currently exist as a
            tradable asset. No token sale, minting, or smart contract deployment
            has occurred. This page is for informational purposes only.
          </p>
        </div>
      </section>
    </div>
  )
}
