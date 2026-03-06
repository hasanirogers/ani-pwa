import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async ({ locals, cookies, request }, next) => {
  // Check for auth cookies first before creating Supabase client
  const projectName = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;
  const accessToken = cookies.get(`sb-${projectName}-auth-token`)?.value;

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
          // Include both UUID and integer ID in user object
          locals.user = {
            id: profile.id, // Use integer ID from profile for database operations
            uuid: payload.sub, // Keep UUID for auth reference
            email: payload.email,
            aud: payload.aud || 'authenticated',
            created_at: payload.created_at || new Date().toISOString(),
            user_metadata: payload.user_metadata || {},
            app_metadata: payload.app_metadata || {},
          };
        } else {
          // Fallback if no profile found
          locals.user = {
            id: payload.sub, // UUID fallback
            uuid: payload.sub,
            email: payload.email,
            aud: payload.aud || 'authenticated',
            created_at: payload.created_at || new Date().toISOString(),
            user_metadata: payload.user_metadata || {},
            app_metadata: payload.app_metadata || {},
          };
        }
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
