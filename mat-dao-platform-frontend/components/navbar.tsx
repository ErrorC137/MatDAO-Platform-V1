"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, Wallet, LogOut, User, Loader2 } from "lucide-react"
import { useAuth } from "@/context/auth-context"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Why Us?", href: "/why-us" },
  { label: "Project", href: "/project" },
  { label: "AI Studio", href: "/ai-studio" },
  { label: "Our Ecosystem", href: "/our-ecosystem" },
  { label: "Co-Founder Match", href: "/co-founder-match" },
  { label: "AI Verification", href: "/ai-auditor", roles: ["researcher", "staff"] },
  { label: "MAT Token", href: "/mattoken" },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, isLoading, connectWallet, disconnectWallet, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const truncatedWallet = user?.walletAddress
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : null

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Add%20a%20subheading%284%29-8oEDuOtVsHXvDTX1gdv6hBkwYJak4N.png"
            alt="MatDAO Logo"
            className="h-8"
          />
        </Link>

        {/* Nav Links */}
        <nav className="hidden items-center rounded-full border border-border/60 bg-secondary/50 px-1 py-1 md:flex">
          {navLinks
            .filter((link) => {
              if (!link.roles) return true
              if (!user) return false
              return link.roles.includes(user.role)
            })
            .map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${isActive
                  ? "bg-muted-foreground/20 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right side: Wallet + Auth */}
        <div className="flex items-center gap-3">
          {/* Connect Wallet Button */}
          {user && !user.walletAddress && (
            <button
              onClick={connectWallet}
              disabled={isLoading}
              className="hidden items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50 md:flex"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Wallet className="h-4 w-4" />
              )}
              Connect Wallet
            </button>
          )}

          {/* Wallet Connected Badge */}
          {user?.walletAddress && (
            <div className="hidden items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-medium text-accent md:flex">
              <div className="h-2 w-2 rounded-full bg-accent" />
              {truncatedWallet}
            </div>
          )}

          {/* Auth State */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary/80"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden max-w-[100px] truncate md:inline">
                  {user.name}
                </span>
                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-card p-2 shadow-lg">
                  <div className="mb-2 border-b border-border/40 px-3 pb-2">
                    <p className="text-sm font-medium text-foreground">{user.name}</p>
                    {user.email && (
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    )}
                    <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs capitalize text-primary">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <User className="h-4 w-4" />
                    Profile
                  </Link>

                  {user.walletAddress ? (
                    <button
                      onClick={() => {
                        disconnectWallet()
                        setDropdownOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Wallet className="h-4 w-4" />
                      Disconnect Wallet
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        connectWallet()
                        setDropdownOpen(false)
                      }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <Wallet className="h-4 w-4" />
                      Connect Wallet
                    </button>
                  )}

                  <div className="my-1 h-px bg-border/40" />

                  <button
                    onClick={() => {
                      signOut()
                      setDropdownOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Connect Wallet (when not logged in) */}
              <button
                onClick={connectWallet}
                disabled={isLoading}
                className="hidden items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50 md:flex"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="h-4 w-4" />
                )}
                Connect Wallet
              </button>

              <Link
                href="/auth/sign-in"
                className="rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/80 hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                href="/auth/sign-up"
                className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Launch App
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
