import { defineMiddleware } from 'astro:middleware';
import { createServerClient } from '@supabase/ssr';

export const onRequest = defineMiddleware(async ({ locals, cookies, request }, next) => {
  // Check for auth cookies first before creating Supabase client
  const projectName = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;
  const accessToken = cookies.get(`sb-${projectName}-auth-token`)?.value;
  const supabaseKey = import.meta.env.SUPABASE_API_KEY_PUBLISHABLE;

  // Create Supabase client with auth context
  locals.supabase = createServerClient(
    `https://${projectName}.supabase.co`,
    supabaseKey,
    {
      cookies: {
        get: (key) => cookies.get(key)?.value,
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );

  if (accessToken) {
      try {
        // Decode JWT payload (base64)
        const payload = JSON.parse(atob(accessToken.split('.')[1]));

        // Try to get profile from cookie first, fallback to database
        const profileCookie = cookies.get('user-profile')?.value;
        let profile = null;

        if (profileCookie) {
          try {
            profile = JSON.parse(profileCookie);
          } catch (e) {
            console.error('Error parsing profile cookie:', e);
          }
        }

        if (profile) {
          locals.profile = profile;
        }

        // Create a minimal user object
        locals.user = {
          id: payload.sub,
          email: payload.email,
          aud: payload.aud || 'authenticated',
          created_at: payload.created_at || new Date().toISOString(),
          user_metadata: payload.user_metadata || {},
          app_metadata: payload.app_metadata || {},
        };
    } catch (decodeError) {
      console.error('Token decode error:', decodeError);
      // Token decoding failed, user remains undefined
    }
  }

  // Inject script into head
  const response = next();
  let responseWithHeaders: any = response;

  // Type guard to check if response has expected properties
  if (response && typeof response === 'object') {
    responseWithHeaders = response as { headers?: any, html?: string };

    if ('headers' in responseWithHeaders) {
      responseWithHeaders.headers = responseWithHeaders.headers || {};
      responseWithHeaders.headers.set('Content-Security-Policy', "script-src 'self' 'unsafe-inline'");
    }
  }

  return responseWithHeaders;
});
