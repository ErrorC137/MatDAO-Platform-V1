"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { Mail, Lock, User, Building2, Loader2 } from "lucide-react"

const roles = [
  { value: "researcher" as const, label: "Researcher", description: "Submit and manage research projects" },
  { value: "investor" as const, label: "Investor", description: "Browse and bookmark projects" },
  { value: "staff" as const, label: "Staff", description: "Review and approve submissions" },
]

export default function SignUpPage() {
  const { signUp, isLoading } = useAuth()
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"researcher" | "staff" | "investor">("researcher")
  const [university, setUniversity] = useState("")
  const [error, setError] = useState("")

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name || !email || !password) {
      setError("Please fill in all required fields.")
      return
    }
    try {
      await signUp({ email, password, name, role, university: university || undefined })
      router.push("/")
    } catch (err: any) {
      console.error("Sign up error:", err)
      const errorMessage = err?.message || "Sign up failed. Please try again."
      setError(errorMessage)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Add%20a%20subheading%284%29-8oEDuOtVsHXvDTX1gdv6hBkwYJak4N.png"
            alt="MatDAO Logo"
            className="mx-auto mb-6 h-12"
          />
          <h1 className="mb-2 text-3xl font-bold text-foreground">
            Create Your Account
          </h1>
          <p className="text-sm text-muted-foreground">
            Join the future of materials science commercialization
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/60 bg-card p-8">
          {/* Wallet Button */}
          <div className="mb-6">
            <ConnectButton />
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or sign up with email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email Form */}
          <form onSubmit={handleSignUp} className="flex flex-col gap-5">
            {/* Role Selection */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-foreground">
                I am a...
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                      role === r.value
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-secondary/50 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-sm font-medium text-foreground">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Dr. Jane Smith"
                  className="w-full rounded-lg border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full rounded-lg border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  className="w-full rounded-lg border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                />
              </div>
            </div>

            {role === "researcher" && (
              <div className="flex flex-col gap-2">
                <label htmlFor="university" className="text-sm font-medium text-foreground">
                  University / Institution
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="university"
                    type="text"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    placeholder="Chulalongkorn University"
                    className="w-full rounded-lg border border-border bg-secondary/50 py-3 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
                <p className="text-sm text-destructive">{error}</p>
                {error.includes("wait") && (
                  <button
                    onClick={() => {
                      localStorage.removeItem('auth_cooldown')
                      setError("")
                    }}
                    className="mt-2 text-xs text-destructive/80 underline hover:text-destructive"
                  >
                    Clear cooldown (development only)
                  </button>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              Create Account
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/sign-in"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
