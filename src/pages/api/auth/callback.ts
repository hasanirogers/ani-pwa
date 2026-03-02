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
      const domain = hostname.includes('vercel.app') ? { domain: hostname } : {};

      // Use Supabase's standard cookie names with explicit domain for Vercel
      cookies.set("sb-access-token", access_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 3600,
        ...domain
      });

      cookies.set("sb-refresh-token", refresh_token, {
        path: "/",
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 604800,
        ...domain
      });
    }
  }

  // Return success response
  return new Response(
    JSON.stringify({ success: true, message: 'Login successful' }),
    { status: 200 }
  );
};
