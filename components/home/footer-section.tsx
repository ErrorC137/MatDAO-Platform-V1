import Link from "next/link"

export function FooterSection() {
  return (
    <footer className="border-t border-border/40 bg-background py-12">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Add%20a%20subheading%284%29-8oEDuOtVsHXvDTX1gdv6hBkwYJak4N.png"
              alt="MatDAO Logo"
              className="h-8"
            />
          </div>
          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <Link
              href="/why-us"
              className="transition-colors hover:text-foreground"
            >
              Why Us?
            </Link>
            <Link
              href="/project"
              className="transition-colors hover:text-foreground"
            >
              Projects
            </Link>
            <Link
              href="/ai-studio"
              className="transition-colors hover:text-foreground"
            >
              AI Studio
            </Link>
            <Link
              href="/mattoken"
              className="transition-colors hover:text-foreground"
            >
              MatToken
            </Link>
          </nav>
          <p className="text-sm text-muted-foreground">
            {"© 2026 MatDAO. All rights reserved."}
          </p>
        </div>
      </div>
    </footer>
  )
}
