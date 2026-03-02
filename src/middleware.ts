import { defineMiddleware } from 'astro:middleware';
import { supabaseServerClient } from './shared/database';

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {
  const supabase = supabaseServerClient(cookies);

  // Try to get session normally first
  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (session && session.user) {
      // Store the user in locals for use in Astro components/endpoints
      locals.user = session.user;
    }
  } catch (error) {
    // Fallback: manually decode the access token to get user info
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
  }

  return next();
});
