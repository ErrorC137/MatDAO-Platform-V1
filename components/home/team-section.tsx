export function TeamSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Our Team
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            The core team driving MatDAO forward.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border/60 bg-card">
          <img
            src="https://6ibpna7m8edwyvzk.public.blob.vercel-storage.com/MatDAO_Final_20260216_205234_0000.png"
            alt="MatDAO Team"
            className="w-full object-contain"
          />
        </div>
      </div>
    </section>
  )
}
