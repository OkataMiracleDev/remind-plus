import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase server environment variables")
}

// Admin client (no RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ✅ Fix: handle both sync and async versions of `cookies()`
export const createServerSupabaseClient = () => {
  const maybeCookies = cookies()
  const cookieStore =
    typeof (maybeCookies as any).then === "function"
      ? // @ts-ignore handle older type that returns Promise
        (async () => await maybeCookies)()
      : maybeCookies

  return createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const store = await cookieStore
          return store.get(name)?.value
        },
        async set(name: string, value: string, options: any) {
          const store = await cookieStore
          try {
            store.set({ name, value, ...options })
          } catch {
            // ignored during SSR
          }
        },
        async remove(name: string, options: any) {
          const store = await cookieStore
          try {
            store.delete({ name, ...options })
          } catch {
            // ignored during SSR
          }
        },
      },
    }
  )
}

// Get current authenticated user
export const getServerUser = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

// Get current session
export const getServerSession = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  return { session, error }
}
