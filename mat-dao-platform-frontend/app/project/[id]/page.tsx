const projectData: Record<
  string,
  {
    title: string
    phase: string
    researcher: string
    funding: number
    description: string[]
    advantages: { title: string; text: string }[]
  }
> = {
  "g-cap-500": {
    title: "G-Cap 500",
    phase: "Scale-UP Phase",
    researcher: "Prof. Dr. Arnon Jenkins (MIT)",
    funding: 180000,
    description: [
      "G-Cap 500 represents a breakthrough in energy storage through Vertically Aligned Graphene Array (VAGA) technology, designed to solve the two major bottlenecks of today's Li-ion batteries: slow charging and short lifespan.",
      "Thanks to graphene's status as one of the most electrically conductive materials in the world, G-Cap 500 can absorb extremely high current instantaneously. This enables 0-80% charging in just 5 minutes (compared to 1-2 hours for conventional Li-ion batteries) and delivers a lifespan 10-50 times longer than standard batteries.",
      "This technology is not intended to completely replace Li-ion batteries, but rather to fill critical market gaps where ultra-fast charging and emergency power are essential\u2014such as electric buses that recharge at terminals, cargo delivery drones, and AI-grade data center UPS systems requiring immediate high-power backup.",
    ],
    advantages: [
      {
        title: "Extreme Fast Charging (XFC)",
        text: "Charges to near-full capacity in minutes, not hours, dramatically reducing vehicle downtime in commercial operations.",
      },
      {
        title: "Ultra-Long Cycle Life",
        text: "Supports over 100,000 charge cycles (compared to ~2,000 cycles for typical Li-ion batteries), effectively eliminating the need for battery replacement over a vehicle's lifetime and significantly reducing total cost of ownership (TCO).",
      },
      {
        title: "High Power Density",
        text: "Exceptional capability to deliver high burst power, ideal for heavy-duty vehicle acceleration and instant emergency power supply applications.",
      },
      {
        title: "Wide Temperature Range",
        text: "Operates reliably under extreme conditions from -40\u00B0C to +65\u00B0C, with minimal performance degradation.",
      },
    ],
  },
  "cnt-power-cable": {
    title: "CNT Power Cable",
    phase: "Research Phase",
    researcher: "Dr. Somchai Tanaka (Chulalongkorn)",
    funding: 95000,
    description: [
      "CNT Power Cable uses carbon nanotube technology to create next-generation power transmission cables with significantly lower energy loss.",
      "Traditional copper cables lose 5-8% of energy during transmission. CNT cables reduce this to below 1%, making long-distance power transmission far more efficient.",
    ],
    advantages: [
      {
        title: "Ultra-Low Resistance",
        text: "Carbon nanotube-based conductors achieve resistance levels far below copper, minimizing energy losses.",
      },
      {
        title: "Lightweight Design",
        text: "CNT cables weigh 75% less than copper equivalents, reducing infrastructure costs.",
      },
      {
        title: "High Thermal Stability",
        text: "Maintains performance at temperatures exceeding 400\u00B0C.",
      },
    ],
  },
}

function getProject(id: string) {
  return (
    projectData[id] || {
      title: id
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      phase: "Research Phase",
      researcher: "Research Team",
      funding: 50000,
      description: [
        "This is an advanced materials research project currently in development on the MatDAO platform.",
        "More details will be published as the project progresses through its milestones.",
      ],
      advantages: [
        {
          title: "Innovative Material",
          text: "Novel material properties with potential commercial applications.",
        },
        {
          title: "Scalable Process",
          text: "Manufacturing process designed for eventual industrial scale production.",
        },
      ],
    }
  )
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = getProject(id)

  return (
    <div className="flex flex-col">
      {/* Hero Banner */}
      <section className="relative flex min-h-[50vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/graphene-what-is-it-and-what-is-it-used-for-393831-640x360.jpg"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-background/60" />
        </div>
        <div className="relative z-10 flex flex-col items-center gap-4 px-4 text-center">
          <h1 className="text-4xl font-bold text-foreground md:text-5xl">
            {project.title}
          </h1>
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-1 text-sm font-medium text-pink-400">
              {project.phase}
            </span>
            <span className="rounded-full border border-border/60 bg-card px-4 py-1 text-sm text-muted-foreground">
              {project.researcher}
            </span>
          </div>
          <div className="mt-2 rounded-full bg-secondary/60 px-6 py-2 text-lg font-semibold text-foreground backdrop-blur-sm">
            {"Funding : $"}
            {project.funding.toLocaleString()}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="rounded-xl border border-border/60 bg-card p-8">
            {/* Description */}
            <div className="mb-10">
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
                <span className="h-8 w-1 rounded-full bg-primary" />
                Description
              </h2>
              <div className="flex flex-col gap-4">
                {project.description.map((paragraph, i) => (
                  <p
                    key={i}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Material Advantage */}
            <div>
              <h2 className="mb-6 flex items-center gap-3 text-2xl font-bold text-foreground">
                <span className="h-8 w-1 rounded-full bg-primary" />
                Material Advantage
              </h2>
              <div className="flex flex-col gap-4">
                {project.advantages.map((advantage) => (
                  <div key={advantage.title}>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {advantage.title}:{" "}
                      </span>
                      {advantage.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
