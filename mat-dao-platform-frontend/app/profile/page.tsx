"use client"

import { useAuth } from "@/context/auth-context"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Wallet, Mail, User, Building2, Shield, Copy, Check, ExternalLink } from "lucide-react"
import { useState } from "react"

export default function ProfilePage() {
  const { user, connectWallet, disconnectWallet, isLoading } = useAuth()
  const router = useRouter()
  const [copied, setCopied] = useState(false)

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 px-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
          <User className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Not Signed In</h1>
        <p className="text-center text-sm text-muted-foreground">
          Sign in or connect your wallet to view your profile.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/auth/sign-in"
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Sign In
          </Link>
          <Link
            href="/auth/sign-up"
            className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            Create Account
          </Link>
        </div>
      </div>
    )
  }

  function handleCopyWallet() {
    if (user?.walletAddress) {
      navigator.clipboard.writeText(user.walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex flex-col items-center px-4 py-16">
      <div className="w-full max-w-2xl">
        {/* Profile Header */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 text-2xl font-bold text-primary">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
            <span className="mt-1 inline-block rounded-full bg-primary/10 px-3 py-0.5 text-xs capitalize text-primary">
              {user.role}
            </span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-4">
          {/* Account Info */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Shield className="h-5 w-5 text-primary" />
              Account Information
            </h2>
            <div className="flex flex-col gap-4">
              {user.email && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm text-foreground">{user.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                  <User className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm capitalize text-foreground">{user.role}</p>
                </div>
              </div>
              {user.university && (
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Institution</p>
                    <p className="text-sm text-foreground">{user.university}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Wallet Section */}
          <div className="rounded-xl border border-border/60 bg-card p-6">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Wallet className="h-5 w-5 text-primary" />
              Wallet
            </h2>

            {user.walletAddress ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Connected Address</p>
                    <p className="mt-0.5 font-mono text-sm text-foreground">
                      {user.walletAddress}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyWallet}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    aria-label="Copy wallet address"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-accent" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-xs text-accent">Connected</span>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="self-start rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                >
                  Disconnect Wallet
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 rounded-lg border border-dashed border-border bg-secondary/30 px-6 py-8">
                <Wallet className="h-8 w-8 text-muted-foreground" />
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">
                    No wallet connected
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Connect your wallet to participate in governance and funding
                  </p>
                </div>
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="rounded-full border border-primary/40 bg-primary/10 px-6 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/20 disabled:opacity-50"
                >
                  Connect Wallet
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {user.role === "researcher" && (
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <Link
                  href="/submit"
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3 text-sm transition-colors hover:bg-secondary/60"
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Submit New Project</span>
                </Link>
                <Link
                  href="/project"
                  className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/30 px-4 py-3 text-sm transition-colors hover:bg-secondary/60"
                >
                  <ExternalLink className="h-4 w-4 text-primary" />
                  <span className="text-foreground">Browse Marketplace</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
