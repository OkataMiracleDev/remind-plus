import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Auth helper functions
export const signUp = async (
  email: string,
  password: string,
  name?: string,
  role: 'admin' | 'user' = 'user'
) => {
  const siteEnv = process.env.NEXT_PUBLIC_SITE_URL
  const siteUrl = siteEnv ?? (typeof window !== 'undefined' ? window.location.origin : undefined)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: siteUrl ? `${siteUrl}/auth/login` : undefined,
      data: {
        name: name || '',
        role, // <- saved into Supabase user_metadata
        onboardingComplete: false
      }
    }
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

// ✅ New helper: sign in and get fresh user with role
export const signInAndGetRole = async (email: string, password: string) => {
  const { data: signInData, error: signInError } = await signIn(email, password)
  if (signInError) return { data: null, error: signInError }

  // Fetch fresh user to get updated user_metadata (role)
  const { data: userData, error: userError } = await supabase.auth.getUser()
  if (userError) return { data: null, error: userError }

  let user = userData.user
  const currentRole = user?.user_metadata?.role

  // ✅ Robustness: if role is missing, default to 'user' and backfill
  if (!currentRole && user) {
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role: 'user' }
    })
    if (!updateError) {
      const { data: refetch } = await supabase.auth.getUser()
      user = refetch.user ?? user
    }
  }

  return { data: user, error: null }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}
