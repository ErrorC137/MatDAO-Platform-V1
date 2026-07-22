"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/client"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected, walletConnect } from 'wagmi/connectors'

// Local cooldown tracking
const COOLDOWN_KEY = 'auth_cooldown'
const COOLDOWN_DURATION = 5 * 60 * 1000 // 5 minutes

function getCooldownRemaining(): number {
  const cooldownEnd = localStorage.getItem(COOLDOWN_KEY)
  if (!cooldownEnd) return 0
  const remaining = parseInt(cooldownEnd) - Date.now()
  return Math.max(0, remaining)
}

function setCooldown(): void {
  localStorage.setItem(COOLDOWN_KEY, (Date.now() + COOLDOWN_DURATION).toString())
}

function clearCooldown(): void {
  localStorage.removeItem(COOLDOWN_KEY)
}

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
  const { address, isConnected } = useAccount()
  const { connect } = useConnect()
  const { disconnect } = useDisconnect()

  // Log wallet state changes for debugging
  useEffect(() => {
    console.log('Wagmi wallet state:', { isConnected, address })
  }, [isConnected, address])

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

  // Sync wallet connection with user state
  useEffect(() => {
    const handleWalletConnection = async () => {
      console.log('Wallet connection state changed:', { isConnected, address, user })

      if (isConnected && address) {
        if (user) {
          // Only update if wallet address has changed
          if (user.walletAddress !== address) {
            console.log('Updating wallet address for existing user:', user.id, 'new address:', address)
            const { error } = await supabase
              .from('profiles')
              .update({ wallet_address: address })
              .eq('id', user.id)

            if (!error) {
              console.log('Wallet address updated successfully in database')
              setUser({ ...user, walletAddress: address })
              console.log('User state updated with wallet address:', address)
            } else {
              console.error('Error updating wallet address:', error)
            }
          }
        } else {
          // No email user signed in - wallet connection requires email sign-in first
          console.log('Wallet connected but no email user. Please sign in with email first to link wallet.')
          // Do not create wallet-only user - require email sign-in first
        }
      } else if (!isConnected && user && user.walletAddress) {
        // Wallet disconnected, remove wallet address from profile
        console.log('Wallet disconnected, removing wallet address from profile')
        const { error } = await supabase
          .from('profiles')
          .update({ wallet_address: null })
          .eq('id', user.id)

        if (!error) {
          setUser({ ...user, walletAddress: null })
        }
      }
    }

    handleWalletConnection()
  }, [isConnected, address, user])

  const loadUserProfile = async (userId: string) => {
    console.log('loadUserProfile called for userId:', userId)
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error loading profile:', error)
      return
    }

    if (profile) {
      console.log('Profile loaded successfully:', profile)
      setUser({
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role as User['role'],
        walletAddress: profile.wallet_address,
        university: profile.university,
      })
      console.log('User state set to:', profile)
    } else {
      console.error('Profile not found for user:', userId)
    }
  }

  const signIn = useCallback(async (email: string, password: string) => {
    setIsLoading(true)
    try {
      console.log('Attempting sign in with email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Sign in error from Supabase:', error)
        // Handle rate limit errors
        if (error.message.includes('rate limit') || error.message.includes('too many requests')) {
          throw new Error('Too many sign in attempts. Please wait a few minutes before trying again.')
        }
        throw error
      }

      console.log('Sign in successful, user data:', data.user)
      if (data.user) {
        console.log('Loading user profile for:', data.user.id)
        await loadUserProfile(data.user.id)
        console.log('User profile loaded, current user state:', user)
      }
    } catch (error) {
      console.error('Sign in error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user])

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
        console.log('Attempting sign up with email:', data.email)
        
        // Check cooldown
        const cooldownRemaining = getCooldownRemaining()
        if (cooldownRemaining > 0) {
          const minutes = Math.ceil(cooldownRemaining / 60000)
          throw new Error(`Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`)
        }

        // Check if email already exists in profiles
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', data.email)
          .single()

        if (existingProfile) {
          throw new Error('This email is already registered. Please sign in instead.')
        }

        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        })

        if (authError) {
          console.error('Sign up auth error:', authError)
          // Handle rate limit errors more specifically
          if (authError.message.includes('rate limit') || 
              authError.message.includes('too many requests') ||
              authError.message.includes('Too many requests')) {
            setCooldown()
            throw new Error('Sign up rate limit reached. Please wait 5-10 minutes before trying again, or use a different email address.')
          }
          if (authError.message.includes('User already registered')) {
            throw new Error('This email is already registered. Please sign in instead.')
          }
          throw authError
        }

        console.log('Sign up auth successful, creating profile')
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

          if (profileError) {
            // If profile creation fails, try to delete the auth user to avoid partial state
            await supabase.auth.admin.deleteUser(authData.user.id)
            throw profileError
          }

          setUser({
            id: authData.user.id,
            email: data.email,
            name: data.name,
            role: data.role,
            walletAddress: null,
            university: data.university || null,
          })
          
          // Clear cooldown on success
          clearCooldown()
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
      // Require email sign-in first
      if (!user) {
        throw new Error('Please sign in with your email first before connecting your wallet.')
      }

      // Check cooldown
      const cooldownRemaining = getCooldownRemaining()
      if (cooldownRemaining > 0) {
        const minutes = Math.ceil(cooldownRemaining / 60000)
        throw new Error(`Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`)
      }

      // Try to connect with injected connector (MetaMask, etc.) first
      // If that fails, try walletConnect for mobile support
      try {
        await connect({ connector: injected() })
      } catch (injectedError) {
        console.log('Injected connector failed, trying walletConnect:', injectedError)
        // Try walletConnect for mobile browsers
        try {
          const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
          if (!projectId) {
            throw new Error('WalletConnect Project ID not configured. Please add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID to your environment variables.')
          }
          await connect({ connector: walletConnect({ projectId }) })
        } catch (wcError) {
          console.error('Both connectors failed:', wcError)
          // Check if it's a timeout error
          if (wcError instanceof Error && wcError.message.includes('timeout') || wcError.message.includes('timed out')) {
            throw new Error('Wallet connection timed out. Please check your wallet connection and try again.')
          }
          throw new Error('Failed to connect wallet. Please ensure you have a wallet installed or use a mobile wallet app.')
        }
      }

      // Wait for the address to be available with timeout
      const maxWaitTime = 10000 // 10 seconds
      const startTime = Date.now()
      
      while (!address && Date.now() - startTime < maxWaitTime) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      if (address) {
        const walletAddress = address

        // Update existing user's wallet address
        const { error } = await supabase
          .from('profiles')
          .update({ wallet_address: walletAddress })
          .eq('id', user.id)

        if (error) {
          // Handle rate limit errors more specifically
          if (error.message.includes('rate limit') ||
              error.message.includes('too many requests') ||
              error.message.includes('Too many requests')) {
            setCooldown()
            throw new Error('Wallet connection rate limit reached. Please wait 5-10 minutes before trying again.')
          }
          throw error
        }

        setUser({ ...user, walletAddress: walletAddress })
      } else {
        throw new Error('Wallet connection timeout. Please ensure your wallet is unlocked and try again.')
      }

      // Clear cooldown on success
      clearCooldown()
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [user, connect, address])

  const disconnectWallet = useCallback(async () => {
    try {
      // Disconnect from wagmi
      await disconnect()
      
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
    } catch (error) {
      console.error('Wallet disconnection error:', error)
      throw error
    }
  }, [user, disconnect, signOut])

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
