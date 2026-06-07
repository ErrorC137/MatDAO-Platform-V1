"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export interface User {
  id: string
  email: string
  name: string
  role: "researcher" | "staff" | "investor"
  walletAddress: string | null
  university: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: {
    email: string
    password: string
    name: string
    role: "researcher" | "staff" | "investor"
    university?: string
  }) => Promise<void>
  signOut: () => void
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const signIn = useCallback(async (email: string, _password: string) => {
    setIsLoading(true)
    // Simulated sign in — replace with Supabase Auth in production
    await new Promise((resolve) => setTimeout(resolve, 800))
    setUser({
      id: crypto.randomUUID(),
      email,
      name: email.split("@")[0],
      role: "researcher",
      walletAddress: null,
      university: null,
    })
    setIsLoading(false)
  }, [])

  const signUp = useCallback(
    async (data: {
      email: string
      password: string
      name: string
      role: "researcher" | "staff" | "investor"
      university?: string
    }) => {
      setIsLoading(true)
      // Simulated sign up — replace with Supabase Auth in production
      await new Promise((resolve) => setTimeout(resolve, 800))
      setUser({
        id: crypto.randomUUID(),
        email: data.email,
        name: data.name,
        role: data.role,
        walletAddress: null,
        university: data.university || null,
      })
      setIsLoading(false)
    },
    []
  )

  const signOut = useCallback(() => {
    setUser(null)
  }, [])

  const connectWallet = useCallback(async () => {
    setIsLoading(true)
    // Simulated wallet connection — generates a fake address
    await new Promise((resolve) => setTimeout(resolve, 600))
    const fakeAddress =
      "0x" +
      Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("")

    setUser((prev) => {
      if (prev) {
        return { ...prev, walletAddress: fakeAddress }
      }
      // If no user is signed in, create a wallet-only user
      return {
        id: crypto.randomUUID(),
        email: "",
        name: `${fakeAddress.slice(0, 6)}...${fakeAddress.slice(-4)}`,
        role: "investor",
        walletAddress: fakeAddress,
        university: null,
      }
    })
    setIsLoading(false)
  }, [])

  const disconnectWallet = useCallback(() => {
    setUser((prev) => {
      if (prev && prev.email) {
        return { ...prev, walletAddress: null }
      }
      // If wallet-only user, sign out entirely
      return null
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
