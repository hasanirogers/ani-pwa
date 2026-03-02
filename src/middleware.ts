import { defineMiddleware } from 'astro:middleware';
import { supabaseServerClient } from './shared/database';

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {
  // Check for auth cookies first before creating Supabase client
  const projectName = import.meta.env.SUPABASE_PROJECT_ID || 'empjkbtwrtuaitcrxxsa';
  const accessToken = cookies.get(`sb-${projectName}-auth-token`)?.value;

  console.log('=== MIDDLEWARE DEBUG ===');
  console.log('Project ID:', import.meta.env.SUPABASE_PROJECT_ID);
  console.log('Looking for cookie:', `sb-${projectName}-auth-token`);
  console.log('Access token found:', !!accessToken);
  console.log('Access token length:', accessToken?.length || 0);

  if (accessToken) {
    try {
      // Decode JWT payload (base64)
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      console.log('Decoded user email:', payload.email);

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

  // Inject user data into DOM for frontend store to access
  const script = `
    if (typeof window !== 'undefined') {
      window.__ASTRO_USER__ = ${JSON.stringify(locals.user || null)};
    }
  `;

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

    // Append script to response
    if ('html' in responseWithHeaders) {
      responseWithHeaders.html = (responseWithHeaders.html || '') + `<script>${script}</script>`;
    }
  }

  return responseWithHeaders;
});
