const stats = [
  { value: "5+", label: "Research Projects" },
  { value: "$400K+", label: "Total Funding" },
  { value: "TRL 4-8", label: "Stage Coverage" },
  { value: "3", label: "Countries" },
]

export function StatsSection() {
  return (
    <section className="border-y border-border/40 bg-secondary/30 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="mb-2 text-3xl font-bold text-primary md:text-4xl">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
