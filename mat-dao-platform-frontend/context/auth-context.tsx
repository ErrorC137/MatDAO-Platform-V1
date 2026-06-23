"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/client"
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

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
          // Update existing user's wallet address in Supabase
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
        } else {
          // Check if a user with this wallet address already exists
          console.log('Checking for existing user with wallet address:', address)
          const { data: existingProfile, error: queryError } = await supabase
            .from('profiles')
            .select('*')
            .eq('wallet_address', address)
            .single()

          if (queryError && queryError.code !== 'PGRST116') {
            console.error('Error querying for existing profile:', queryError)
          }

          if (existingProfile) {
            // User exists with this wallet, but we can't sign them in without password
            // For now, just show a message that they need to sign in with email first
            console.log('User exists with this wallet address. Please sign in with email first.')
          } else {
            // Create wallet-only user (investor)
            console.log('Creating new wallet-only user for address:', address)
            const { data: authData, error: authError } = await supabase.auth.signUp({
              email: `${address}@wallet.temp`,
              password: crypto.randomUUID(),
            })

            if (authError) {
              console.error('Error creating wallet user:', authError)
            } else if (authData.user) {
              console.log('Auth user created, now creating profile')
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: authData.user.id,
                  email: `${address}@wallet.temp`,
                  name: `${address.slice(0, 6)}...${address.slice(-4)}`,
                  role: 'investor',
                  university: null,
                  wallet_address: address,
                })

              if (profileError) {
                console.error('Error creating wallet profile:', profileError)
              } else {
                console.log('Wallet profile created successfully')
                setUser({
                  id: authData.user.id,
                  email: `${address}@wallet.temp`,
                  name: `${address.slice(0, 6)}...${address.slice(-4)}`,
                  role: 'investor',
                  walletAddress: address,
                  university: null,
                })
              }
            }
          }
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
      // Check cooldown
      const cooldownRemaining = getCooldownRemaining()
      if (cooldownRemaining > 0) {
        const minutes = Math.ceil(cooldownRemaining / 60000)
        throw new Error(`Please wait ${minutes} minute${minutes > 1 ? 's' : ''} before trying again.`)
      }

      // Use actual wallet connection via wagmi
      await connect({ connector: injected() })
      
      // Wait for the address to be available
      if (address) {
        const walletAddress = address

        if (user) {
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
          // Create wallet-only user (investor)
          const { data: authData, error: authError } = await supabase.auth.signUp({
            email: `${walletAddress}@wallet.temp`,
            password: crypto.randomUUID(),
          })

          if (authError) {
            // Handle rate limit errors
            if (authError.message.includes('rate limit') || authError.message.includes('too many requests')) {
              throw new Error('Too many wallet connection attempts. Please wait a moment and try again.')
            }
            throw authError
          }

          if (authData.user) {
            const { error: profileError } = await supabase
              .from('profiles')
              .insert({
                id: authData.user.id,
                email: `${walletAddress}@wallet.temp`,
                name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
                role: 'investor',
                university: null,
                wallet_address: walletAddress,
              })

            if (profileError) throw profileError

            setUser({
              id: authData.user.id,
              email: `${walletAddress}@wallet.temp`,
              name: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`,
              role: 'investor',
              walletAddress: walletAddress,
              university: null,
            })
          }
        }
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
