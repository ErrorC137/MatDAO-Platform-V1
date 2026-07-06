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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[60px] max-w-7xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Add%20a%20subheading%284%29-8oEDuOtVsHXvDTX1gdv6hBkwYJak4N.png" 
              alt="MatDAO Logo" 
              className="h-8 transition-transform group-hover:scale-105" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#6efcff]/20 to-transparent rounded-lg blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </Link>

        <nav className="hidden items-center gap-1 rounded-2xl border border-border/60 bg-secondary/40 px-2 py-1.5 md:flex backdrop-blur-sm">
          {navLinks
            .filter((link) => !link.roles || (user && link.roles.includes(user.role)))
            .map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
              return (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={`relative rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-r from-[#6efcff]/20 to-[#6efcff]/5 text-[#c5fdff] shadow-lg shadow-[#6efcff]/10" 
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-transparent via-[#6efcff] to-transparent rounded-full" />
                  )}
                </Link>
              )
            })}
        </nav>

        <div className="flex items-center gap-3">
          {/* RainbowKit Connect Button */}
          <div className="hidden sm:block">
            <ConnectButton accountStatus="avatar" chainStatus="icon" showBalance={false} />
          </div>

          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)} 
                className="flex items-center gap-2.5 rounded-2xl border border-border/60 bg-secondary/40 px-3 py-2 text-sm text-foreground transition-all duration-200 hover:bg-secondary/60 hover:border-border/80 backdrop-blur-sm"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-gradient-to-br from-[#6efcff]/30 to-[#6efcff]/10 text-sm font-bold text-[#c5fdff] shadow-inner">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:inline font-medium">{user.name}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-3 w-56 rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl p-2 shadow-2xl shadow-black/20">
                  <Link 
                    href="/profile" 
                    onClick={() => setDropdownOpen(false)} 
                    className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-colors"
                  >
                    <User className="h-4 w-4" /> 
                    <span className="font-medium">Profile</span>
                  </Link>
                  <div className="my-1 h-px bg-border/40" />
                  <button 
                    onClick={() => { signOut(); setDropdownOpen(false); }} 
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" /> 
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link 
                href="/auth/sign-in" 
                className="rounded-2xl border border-border/60 bg-secondary/40 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all duration-200"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/sign-up" 
                className="rounded-2xl bg-gradient-to-r from-[#6efcff] to-[#6efcff]/80 px-4 py-2 text-sm font-semibold text-black hover:from-[#6efcff]/90 hover:to-[#6efcff]/70 transition-all duration-200 shadow-lg shadow-[#6efcff]/20"
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