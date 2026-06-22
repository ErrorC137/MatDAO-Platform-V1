"use client"
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { ChevronDown, LogOut, User } from "lucide-react"
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
  { label: "Guide", href: "/guide" },
]

export function Navbar() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Add%20a%20subheading%284%29-8oEDuOtVsHXvDTX1gdv6hBkwYJak4N.png" alt="MatDAO Logo" className="h-8" />
        </Link>

        <nav className="hidden items-center rounded-full border border-border/60 bg-secondary/50 px-1 py-1 md:flex">
          {navLinks
            .filter((link) => !link.roles || (user && link.roles.includes(user.role)))
            .map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link key={link.href} href={link.href} className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${isActive ? "bg-muted-foreground/20 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                  {link.label}
                </Link>
              )
            })}
        </nav>

        <div className="flex items-center gap-3">
          {/* เปลี่ยนปุ่มเดิมเป็น ConnectButton ของ RainbowKit */}
          <ConnectButton accountStatus="avatar" chainStatus="icon" />

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-sm text-foreground transition-colors hover:bg-secondary/80">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">{user.name.charAt(0).toUpperCase()}</div>
                <span className="hidden md:inline">{user.name}</span>
                <ChevronDown className={`h-4 w-4 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-border/60 bg-card p-2 shadow-lg">
                  <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"><User className="h-4 w-4" /> Profile</Link>
                  <button onClick={() => { signOut(); setDropdownOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" /> Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth/sign-in" className="rounded-full border border-border/60 bg-secondary/50 px-4 py-1.5 text-sm font-medium text-muted-foreground hover:bg-secondary/80">Sign In</Link>
              <Link href="/auth/sign-up" className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90">Launch App</Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}