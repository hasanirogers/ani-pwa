import { createServerClient, parseCookieHeader } from '@supabase/ssr'
import { defineMiddleware } from 'astro:middleware'

export const onRequest = defineMiddleware(async ({ locals, request, cookies }, next) => {
  // Debug: Log incoming cookies in detail
  const rawCookieHeader = request.headers.get('Cookie');
  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Raw cookie header:', rawCookieHeader);

  const incomingCookies = parseCookieHeader(rawCookieHeader ?? '');
  console.log('Parsed cookies count:', incomingCookies.length);
  console.log('Parsed cookies details:', incomingCookies.map((c: any) => ({
    name: c.name,
    value: c.value ? 'PRESENT' : 'MISSING',
    valueLength: c.value?.length || 0
  })));

  locals.supabase = createServerClient(
    `https://${import.meta.env.SUPABASE_PROJECT_ID}.supabase.co`,
    import.meta.env.SUPABASE_API_KEY_PUBLISHABLE,
    {
      cookies: {
        getAll() {
          const allCookies = parseCookieHeader(request.headers.get('Cookie') ?? '')
            .filter(cookie => cookie.value !== undefined)
            .map(cookie => ({ name: cookie.name, value: cookie.value! }));
          console.log('Supabase client cookies count:', allCookies.length);
          console.log('Supabase client cookies:', allCookies.map((c: any) => ({
            name: c.name,
            value: c.value ? 'PRESENT' : 'MISSING',
            valueLength: c.value?.length || 0
          })));
          return allCookies;
        },
        setAll(cookiesToSet) {
          console.log('Middleware setting cookies:', cookiesToSet.map((c: any) => ({
            name: c.name,
            hasValue: !!c.value,
            valueLength: c.value?.length || 0,
            options: c.options
          })));
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
