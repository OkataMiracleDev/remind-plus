import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()

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

  // ✅ Refresh or sync session cookies before checking
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  // ✅ If Supabase updated cookies, apply them to the response
  const response = res || NextResponse.next()
  const newAccessToken = session?.access_token
  if (newAccessToken) {
    response.cookies.set({
      name: 'sb-access-token',
      value: newAccessToken,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    })
  }

  // 🪵 Debug logs
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

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*', '/auth/login'],
}
