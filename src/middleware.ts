import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async ({ locals, request, cookies }, next) => {
  locals.supabase = createServerClient(
    `https://${import.meta.env.SUPABASE_PROJECT_ID}.supabase.co`,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(request.headers.get('Cookie') ?? '')
            .filter(cookie => cookie.value !== undefined)
            .map(cookie => ({ name: cookie.name, value: cookie.value! }))
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, options)
          )
        },
      },
    }
  )

  return next()
})
