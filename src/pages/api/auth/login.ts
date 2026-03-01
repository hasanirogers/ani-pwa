import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const origin = url.origin;
  const data = await request.json();
  const { identifier } = data;

  try {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: identifier,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${origin}/callbacks/email`,
      }
    });

    if (error) {
      console.log(error);
      let message = error.message;

      if (error.code === 'over_email_send_rate_limit') {
        message = 'Please wait 30 seconds before requesting another login link.';
      }

      return new Response(
        JSON.stringify({ success: false, message, error }),
        { status: error.status || 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Success!', user: data.user, session: data.session }),
      { status: 200 }
    );
  } catch(error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
