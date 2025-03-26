import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  isProd,
  NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY
} from '../util/env'
import {
  LOGINED_CHECK_FAILED_REDIRECT_URL,
  isLoginedCheckUrl
} from './const/config'
import { createServerClient } from '@supabase/ssr'
import { CookieOptionsBase } from '~/lib/supabase/cookie'

/**
 * Next.js middleware
 * Supabaseのセッションを更新する
 * */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)'
  ]
}
export async function middleware(req: NextRequest) {
  !isProd && console.log('middleware', req.url)

  return await updateSession(req)
}

export async function updateSession(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers
    }
  })

  try {
    const supabase = createServerClient(
      NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY,
      {
        cookies: {
          getAll: async () => {
            return req.cookies.getAll()
          },
          setAll: async (cookiesToSet) => {
            for (const cookie of cookiesToSet) {
              req.cookies.set(cookie.name, cookie.value)
            }

            res = NextResponse.next({
              request: req
            })

            for (const cookie of cookiesToSet) {
              res.cookies.set(cookie.name, cookie.value, cookie.options)
            }
          }
        },
        cookieOptions: CookieOptionsBase
      }
    )

    // ログイン済みチェックが必要な場合は実装する
    const { data: user, error } = await supabase.auth.getUser()

    // 認証をスキップするパスのリスト
    const publicPaths = ['/', '/admin/signin', '/signup']

    // ログインチェック
    if (!publicPaths.includes(req.nextUrl.pathname) && (error || !user.user)) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/'
      redirectUrl.searchParams.set('redirectedFrom', req.nextUrl.pathname)

      return NextResponse.redirect(redirectUrl)
    }

    // 管理者ページへのアクセス制御
    if (
      req.nextUrl.pathname.startsWith('/admin') &&
      req.nextUrl.pathname !== '/admin/signin' &&
      (!user.user || user.user.user_metadata.role !== 'ADMIN')
    ) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/signin'

      return NextResponse.redirect(redirectUrl)
    }

    return res
  } catch (e) {
    return NextResponse.next({
      request: {
        headers: req.headers
      }
    })
  }
}
