"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/client"

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
  signOut: () => Promise<void>
  connectWallet: () => Promise<void>
  disconnectWallet: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        await loadUserProfile(session.user.id)
      }
      setIsLoading(false)
    }

    checkSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserProfile(session.user.id)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profile) {
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as User['role'],
        walletAddress: profile.wallet_address,
        university: profile.university,
      })
    }
  }

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        await loadUserProfile(data.user.id)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
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
      try {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })

        if (authError) throw authError

        if (authData.user) {
          // Create profile
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: data.email,
              name: data.name,
              role: data.role,
              university: data.university || null,
              wallet_address: null,
            })

          if (profileError) throw profileError

          setUser({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.role,
            walletAddress: null,
            university: data.university || null,
          })
        }
      } catch (error) {
        console.error('Sign up error:', error)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setUser(null)
  }, [])

  const connectWallet = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulated wallet connection — in production, integrate with actual wallet provider
      await new Promise((resolve) => setTimeout(resolve, 600))
      const fakeAddress =
        "0x" +
        Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")

      if (user) {
        // Update existing user's wallet address
        const { error } = await supabase
          .from('profiles')
          .update({ wallet_address: fakeAddress })
          .eq('id', user.id)

        if (error) throw error

        setUser({ ...user, walletAddress: fakeAddress })
      } else {
        // Create wallet-only user (investor)
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: `${fakeAddress}@wallet.temp`,
          password: crypto.randomUUID(),
        })

        if (authError) throw authError

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              email: `${fakeAddress}@wallet.temp`,
              name: `${fakeAddress.slice(0, 6)}...${fakeAddress.slice(-4)}`,
              role: 'investor',
              university: null,
              wallet_address: fakeAddress,
            })

          if (profileError) throw profileError

          setUser({
            id: authData.user.id,
            email: `${fakeAddress}@wallet.temp`,
            name: `${fakeAddress.slice(0, 6)}...${fakeAddress.slice(-4)}`,
            role: 'investor',
            walletAddress: fakeAddress,
            university: null,
          })
        }
      }
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user])

  const disconnectWallet = useCallback(async () => {
    if (user && user.email.includes('@wallet.temp')) {
      // Wallet-only user, sign out entirely
      await signOut()
    } else if (user) {
      // Regular user, just remove wallet address
      const { error } = await supabase
        .from('profiles')
        .update({ wallet_address: null })
        .eq('id', user.id)

      if (error) throw error

      setUser({ ...user, walletAddress: null })
    }
  }, [user, signOut])

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
