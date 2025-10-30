"use client"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Session, User } from "@supabase/supabase-js"
import { supabase, signIn as clientSignIn, signOut as clientSignOut, signUp as clientSignUp, getSession as clientGetSession } from "../lib/supabaseClient"

type AuthContextValue = {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ data: any }>
  signOut: () => Promise<void>
  signUp: (email: string, password: string, name?: string, role?: 'admin' | 'user') => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const { session: initialSession } = (await clientGetSession()).session ? await clientGetSession() : { session: null }
      setSession(initialSession ?? null)
      setUser(initialSession?.user ?? null)
      setLoading(false)
    }
    init()

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
      setUser(newSession?.user ?? null)
    })
    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await clientSignIn(email, password)
      if (error) throw error
      return { data }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const { error } = await clientSignOut()
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name?: string, role: 'admin' | 'user' = 'user') => {
    setLoading(true)
    try {
      const { error } = await clientSignUp(email, password, name, role)
      if (error) throw error
    } finally {
      setLoading(false)
    }
  }

  const value = useMemo<AuthContextValue>(() => ({ user, session, loading, signIn, signOut, signUp }), [user, session, loading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider")
  return ctx
}
