import type { APIRoute } from "astro";
import { supabase } from "../../../shared/database";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body = await request.json();
  const code = body.code;

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error && data.session) {
        const { access_token, refresh_token } = data.session;

        // Debug: Log everything
        console.log('=== COOKIE DEBUG ===');
        console.log('Session data:', { hasAccessToken: !!access_token, hasRefreshToken: !!refresh_token });

        const hostname = new URL(request.url).hostname;
        console.log('Hostname:', hostname);

        const domain = hostname.includes('vercel.app') ? { domain: hostname } : {};
        console.log('Domain setting:', domain);

        // Log existing cookies
        console.log('Existing cookies:', request.headers.get('Cookie'));

        // Use Supabase's standard cookie names with explicit domain for Vercel
        console.log('Setting sb-access-token...');
        cookies.set("sb-access-token", access_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 3600,
          ...domain
        });

        console.log('Setting sb-refresh-token...');
        cookies.set("sb-refresh-token", refresh_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 604800,
          ...domain
        });

        console.log('Cookies set successfully');
        console.log('=== END DEBUG ===');

        // Return success response
        return new Response(
          JSON.stringify({ success: true, message: 'Login successful' }),
          { status: 200 }
        );
      }
    } catch (error) {
      console.error('Error exchanging code for session:', error);
    }
  }

  // Return error response
  return new Response(
    JSON.stringify({ success: false, message: 'Login failed, it appears no code was provided' }),
    { status: 400 }
  );
};
