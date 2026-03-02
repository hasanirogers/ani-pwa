import { defineMiddleware } from 'astro:middleware';
import { supabaseServerClient } from './shared/database';

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {
  // Check for auth cookies first before creating Supabase client
  const projectName = import.meta.env.SUPABASE_PROJECT_ID || 'empjkbtwrtuaitcrxxsa';
  const accessToken = cookies.get(`sb-${projectName}-auth-token`)?.value;

  if (accessToken) {
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));

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
      // Token decoding failed, user remains undefined
    }
  }

  return next();
});
