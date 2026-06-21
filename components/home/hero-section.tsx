import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/Untitled%20design.jpg"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/40" />
      </div>
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 text-center">
        <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
          Fueling The Next{" "}
          <span className="text-foreground">Material Science Breakthrough</span>
        </h1>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-xl">
          A milestone-driven commercialization platform for advanced materials
          research. Submit projects, track progress, and unlock funding.
        </p>
        <Link
          href="/project"
          className="rounded-full border border-border/60 bg-secondary/50 px-8 py-3 text-base font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-secondary/80"
        >
          Explore our project
        </Link>
      </div>
    </section>
  )
}
