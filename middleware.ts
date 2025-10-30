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
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()

  // If user hits login while already authenticated, send them to their dashboard
  if (req.nextUrl.pathname.startsWith('/auth/login') && session) {
    const role = session.user.user_metadata?.role
    const target = role === 'admin' ? '/admin' : '/user'
    return NextResponse.redirect(new URL(target, req.url))
  }

  // Protect admin routes (role enforcement via user metadata)
  if (req.nextUrl.pathname.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }
    const role = session.user.user_metadata?.role
    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/user', req.url))
    }
  }

  // Protect user dashboard routes
  if (req.nextUrl.pathname.startsWith('/user') && !session) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return res
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    // '/auth/login'
  ]
}
