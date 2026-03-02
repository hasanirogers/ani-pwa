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
        const domain = hostname.includes('vercel.app') ? { domain: hostname } : {};

        // Use Supabase's proper cookie naming convention
        const projectName = import.meta.env.SUPABASE_PROJECT_ID;
        cookies.set(`sb-${projectName}-auth-token`, access_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 3600,
          ...domain
        });

        cookies.set(`sb-${projectName}-auth-token-refresh`, refresh_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax",
          maxAge: 604800,
          ...domain
        });

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
