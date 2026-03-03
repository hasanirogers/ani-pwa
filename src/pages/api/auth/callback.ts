import type { APIRoute } from "astro";
import { supabase } from "../../../shared/database";

console.log('*** CALLBACK FILE LOADED ***');

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body = await request.json();
  const code = body.code;

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        const { access_token, refresh_token } = data.session;

        const hostname = new URL(request.url).hostname;
        let domain = {};

        // For Vercel, don't set explicit domain to allow subdomain access
        if (hostname.includes('vercel.app')) {
          // Don't set domain - let browser handle it automatically
        } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          domain = { domain: hostname };
        }

        // Use Supabase's proper cookie naming convention
        const projectName = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;

        // Set access token cookie
        if (access_token) {
          cookies.set(`sb-${projectName}-auth-token`, access_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax" as const,
            maxAge: 3600,
            ...domain
          });
        }

        // Set refresh token cookie
        if (refresh_token) {
          cookies.set(`sb-${projectName}-auth-token-refresh`, refresh_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax" as const,
            maxAge: 604800,
            ...domain
          });
        }

        // Return success response
        return new Response(
          JSON.stringify({ success: true, message: 'Login successful' }),
          { status: 200 }
        );
      } else {
        console.error('Error exchanging code for session:', error);
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
