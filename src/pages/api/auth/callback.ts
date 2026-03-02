import type { APIRoute } from "astro";
import { supabase } from "../../../shared/database";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body = await request.json();
  const code = body.code;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      const { access_token, refresh_token } = data.session;

      // Debug: Log what we're setting
      console.log('Setting cookies for production debug');

      // Get hostname for explicit domain setting
      const hostname = new URL(request.url).hostname;
      const domain = hostname.includes('vercel.app') ? `; Domain=${hostname}` : '';

      // Set cookies manually in response headers for Vercel production
      const accessTokenCookie = `sb:access_token=${access_token}; Path=/; HttpOnly; SameSite=lax; Max-Age=3600${hostname !== 'localhost' ? '; Secure' : ''}${domain}`;
      const refreshTokenCookie = `sb:refresh_token=${refresh_token}; Path=/; HttpOnly; SameSite=lax; Max-Age=604800${hostname !== 'localhost' ? '; Secure' : ''}${domain}`;

      const response = new Response(
        JSON.stringify({ success: true, message: 'Login successful' }),
        { status: 200 }
      );

      // Set both cookies manually
      response.headers.set('Set-Cookie', accessTokenCookie);
      response.headers.append('Set-Cookie', refreshTokenCookie);
      response.headers.set('Content-Type', 'application/json');

      return response;
    }
  }

  // Return success response
  return new Response(
    JSON.stringify({ success: true, message: 'Login successful' }),
    { status: 200 }
  );
};
