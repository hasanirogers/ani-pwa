import type { APIRoute } from "astro";
import { supabase } from "../../../shared/database";

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body = await request.json();
  const code = body.code;

  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.session) {
      const { access_token, refresh_token } = data.session;
      cookies.set("sb:access_token", access_token, { path: "/", httpOnly: true, secure: true, sameSite: "lax", domain: "." + new URL(request.url).hostname });
      cookies.set("sb:refresh_token", refresh_token, { path: "/", httpOnly: true, secure: true, sameSite: "lax", domain: "." + new URL(request.url).hostname });
    }
  }

  // Return success response
  return new Response(
    JSON.stringify({ success: true, message: 'Login successful' }),
    { status: 200 }
  );
};
