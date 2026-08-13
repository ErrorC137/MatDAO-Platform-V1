import { CheckCircle2, Globe, Beaker, TrendingUp, Shield, Users } from "lucide-react"

const reasons = [
  {
    icon: Beaker,
    title: "Built for Researchers",
    description:
      "MatDAO is designed by scientists and engineers who understand the unique challenges of taking advanced materials from lab to market.",
  },
  {
    icon: TrendingUp,
    title: "Milestone-Driven Funding",
    description:
      "Unlock capital as you prove results. Our TRL-based milestone system ensures funding is tied to real progress, not promises.",
  },
  {
    icon: Shield,
    title: "IP Protection First",
    description:
      "Your intellectual property is protected throughout the process. We integrate with university TTOs and respect patent boundaries.",
  },
  {
    icon: Globe,
    title: "Regional to Global",
    description:
      "Starting in Thailand, expanding across Southeast Asia and globally. Join early and help shape the future of materials commercialization.",
  },
  {
    icon: Users,
    title: "Community Governed",
    description:
      "MatDAO is building toward a decentralized governance model where token holders can vote on platform direction and project funding.",
  },
  {
    icon: CheckCircle2,
    title: "Transparent Process",
    description:
      "Every milestone, review, and approval is tracked publicly. Investors and researchers can trust the process.",
  },
]

const phases = [
  {
    phase: "Phase 1",
    region: "Thailand",
    description: "Launch MVP with Thai research institutions and universities.",
    status: "Active",
  },
  {
    phase: "Phase 2",
    region: "Southeast Asia",
    description:
      "Expand to Singapore, Malaysia, Vietnam, and Indonesia research networks.",
    status: "Planned",
  },
  {
    phase: "Phase 3",
    region: "Global",
    description:
      "Open platform globally with full decentralized governance and token economy.",
    status: "Future",
  },
]

export default function WhyUsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center gap-4 border-b border-border/40 px-4 py-20 text-center">
        <h1 className="text-balance text-4xl font-bold text-foreground md:text-5xl">
          Why MatDAO?
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          We bridge the gap between groundbreaking materials research and
          real-world commercialization through structured milestones and
          transparent funding.
        </p>
      </section>

      {/* Reasons Grid */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="rounded-xl border border-border/60 bg-card p-6"
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <reason.icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  {reason.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="border-t border-border/40 bg-secondary/20 py-20">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
            Our Roadmap
          </h2>
          <div className="flex flex-col gap-8">
            {phases.map((item, index) => (
              <div
                key={item.phase}
                className="flex items-start gap-6"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                      item.status === "Active"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-card text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < phases.length - 1 && (
                    <div className="mt-2 h-16 w-px bg-border" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="mb-1 flex items-center gap-3">
                    <span className="text-sm font-medium text-primary">
                      {item.phase}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.status === "Active"
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                  <h3 className="mb-1 text-lg font-semibold text-foreground">
                    {item.region}
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
    </div>
  )
}
