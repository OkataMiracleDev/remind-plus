import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const { data: { session }, error } = await supabase.auth.getSession()

  // 🪵 Log for debugging
  console.log('🧩 MIDDLEWARE SESSION:', {
    path: req.nextUrl.pathname,
    hasSession: !!session,
    email: session?.user?.email,
    role: session?.user?.user_metadata?.role,
    error,
  })

  if (req.nextUrl.pathname.startsWith('/auth/login') && session) {
    const role = session.user.user_metadata?.role
    const target = role === 'admin' ? '/admin' : '/user'
    console.log(`🔁 Redirecting logged-in user (${role}) → ${target}`)
    return NextResponse.redirect(new URL(target, req.url))
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      console.log('🚫 No session: redirecting to /auth/login')
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const role = session.user.user_metadata?.role
    if (role !== 'admin') {
      console.log('⚠️ Non-admin user tried to access /admin, redirecting to /user')
      return NextResponse.redirect(new URL('/user', req.url))
    }
  }

  if (req.nextUrl.pathname.startsWith('/user') && !session) {
    console.log('🚫 No session for /user: redirecting to /auth/login')
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*']
}
