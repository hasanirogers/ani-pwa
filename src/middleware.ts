import { defineMiddleware } from 'astro:middleware';
// import { supabaseServerClient } from './shared/database';

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {
  // Check for auth cookies first before creating Supabase client
  const projectName = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;
  const accessToken = cookies.get(`sb-${projectName}-auth-token`)?.value;
  console.log('Middleware - Project name:', projectName);
  console.log('Middleware - Access token found:', !!accessToken);

  if (accessToken) {
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      // const supabase = supabaseServerClient(cookies);

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

      // If no profile in cookie, fetch from database
      // if (!profile) {
      //   const { data: profileData, error: profileError } = await supabase
      //     .from('Profiles')
      //     .select('*')
      //     .eq('uuid', payload.sub)
      //     .single();

      //   if (profileError) {
      //     console.error('Profile fetch error:', profileError);
      //   } else {
      //     profile = profileData;
      //   }
      // }

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
      console.log('User set in locals:', !!locals.user);
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
