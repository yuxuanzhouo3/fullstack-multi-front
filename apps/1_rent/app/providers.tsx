"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (userData: any) => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  signIn: async () => {},
  signUp: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const signIn = async (email: string, password: string) => {
    try {
      // TODO: Implement Supabase sign in
      // const { data, error } = await supabase.auth.signInWithPassword({
      //   email,
      //   password
      // })

      // Mock sign in for development
      if (email === "testuser@example.com" && password === "Test1234!") {
        const mockUser = {
          id: "mock-user-id-123",
          email,
          firstName: "Test",
          lastName: "User",
          userType: "renter" as const,
          user_metadata: { user_type: "renter" }, // Ensure user_metadata is set for dashboard
        }
        localStorage.setItem("mockUser", JSON.stringify(mockUser))
        setUser(mockUser)
      } else {
        throw new Error("Invalid mock credentials")
      }
    } catch (error) {
      throw new Error("Sign in failed")
    }
  }

  const signUp = async (userData: any) => {
    try {
      // TODO: Implement Supabase sign up
      // const { data, error } = await supabase.auth.signUp({
      //   email: userData.email,
      //   password: userData.password,
      //   options: {
      //     data: {
      //       first_name: userData.firstName,
      //       last_name: userData.lastName,
      //       user_type: userData.userType,
      //       phone: userData.phone
      //     }
      //   }
      // })

      // Mock sign up for development
      const mockUser = {
        id: "mock-user-id-" + Date.now(), // Unique ID for new mock user
        email: userData.email,
        firstName: userData.firstName || "New",
        lastName: userData.lastName || "User",
        userType: userData.userType,
        user_metadata: { user_type: userData.userType }, // Ensure user_metadata is set
      }
      localStorage.setItem("mockUser", JSON.stringify(mockUser))
      setUser(mockUser)
    } catch (error) {
      throw new Error("Sign up failed")
    }
  }

  return <AuthContext.Provider value={{ user, loading, signOut, signIn, signUp }}>{children}</AuthContext.Provider>
}
