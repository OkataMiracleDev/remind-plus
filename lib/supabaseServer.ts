import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Missing Supabase server environment variables")
}

// ✅ Admin client — bypasses RLS for privileged operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ✅ Server-side client — respects RLS and user sessions
export const createServerSupabaseClient = () => {
  const cookieStore = cookies() // ✅ FIXED: cookies() is synchronous in Next.js 15+

  return createServerClient(
    supabaseUrl,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // ignored during SSR
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.delete({ name, ...options })
          } catch {
            // ignored during SSR
          }
        },
      },
    }
  )
}

// ✅ Get current authenticated user on the server
export const getServerUser = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

// ✅ Get current session on the server
export const getServerSession = async () => {
  const supabase = createServerSupabaseClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  return { session, error }
}
