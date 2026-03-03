import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabaseServerClient } from "../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ cookies }) => {
  try {
    // Use server client to access and clear the session
    const supabase = supabaseServerClient(cookies);

    // Sign out the user and clear session cookies
    const { error } = await supabase.auth.signOut();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: error.status || 400 }
      );
    }

    // Clear auth cookies manually to ensure they're removed
    const projectName = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;
    cookies.delete(`sb-${projectName}-auth-token`, { path: '/' });
    cookies.delete(`sb-${projectName}-auth-token-refresh`, { path: '/' });

    return new Response(
      JSON.stringify({ success: true, message: 'Logged out successfully' }),
      { status: 200 }
    );
  } catch(error) {
    console.error('Logout error:', error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

// Also support GET for backward compatibility
export const GET: APIRoute = async ({ cookies }) => {
  return await POST({ cookies } as any);
}
