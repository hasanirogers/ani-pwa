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

      // Try different cookie settings for Vercel production
      const isVercelProd = process.env.VERCEL_ENV === 'production';

      cookies.set("sb:access_token", access_token, {
        path: "/",
        httpOnly: true,
        secure: !process.env.DEV,
        sameSite: "lax",
        maxAge: 3600 // Add explicit expiry
      });

      cookies.set("sb:refresh_token", refresh_token, {
        path: "/",
        httpOnly: true,
        secure: !process.env.DEV,
        sameSite: "lax",
        maxAge: 604800 // 7 days
      });
    }
  }

  // Return success response
  return new Response(
    JSON.stringify({ success: true, message: 'Login successful' }),
    { status: 200 }
  );
};
