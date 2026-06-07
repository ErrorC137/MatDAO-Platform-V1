import { FlaskConical, Milestone, Store, Wallet } from "lucide-react"

const features = [
  {
    icon: FlaskConical,
    title: "Structured Submissions",
    description:
      "Researchers submit standardized commercialization proposals covering technical specs, IP status, and funding needs.",
  },
  {
    icon: Milestone,
    title: "Milestone Tracking",
    description:
      "Break your research into validation milestones tied to TRL stages. Unlock funding as you hit targets.",
  },
  {
    icon: Store,
    title: "Public Marketplace",
    description:
      "Approved projects are showcased in a curated marketplace for investors and partners to discover.",
  },
  {
    icon: Wallet,
    title: "Wallet Integration",
    description:
      "Connect your wallet for seamless identity and future token-based governance participation.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            How MatDAO Works
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            From lab bench to market. We provide the structure and tools to
            commercialize advanced materials research.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border/60 bg-card p-6 transition-colors hover:border-primary/40"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
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
  )
}
