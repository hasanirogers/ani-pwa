import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async ({ locals, request, cookies }, next) => {
  // Debug: Log incoming cookies
  const incomingCookies = parseCookieHeader(request.headers.get('Cookie') ?? '');
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Incoming cookies:', incomingCookies.map(c => ({ name: c.name, hasValue: !!c.value })));

  locals.supabase = createServerClient(
    `https://${import.meta.env.SUPABASE_PROJECT_ID}.supabase.co`,
    import.meta.env.SUPABASE_API_KEY_PUBLISHABLE,
    {
      cookies: {
        getAll() {
          const allCookies = parseCookieHeader(request.headers.get('Cookie') ?? '')
            .filter(cookie => cookie.value !== undefined)
            .map(cookie => ({ name: cookie.name, value: cookie.value! }));
          console.log('Supabase client cookies:', allCookies.map(c => ({ name: c.name, hasValue: !!c.value })));
          return allCookies;
        },
        setAll(cookiesToSet) {
          console.log('Middleware setting cookies:', cookiesToSet.map(c => ({ name: c.name, hasValue: !!c.value })));
          cookiesToSet.forEach(({ name, value, options }) =>
            cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const result = await next();
  console.log('=== END MIDDLEWARE DEBUG ===');
  return result;
})
