import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";
import type { Provider } from "@supabase/supabase-js";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const provider = url.searchParams.get('provider');
  const origin = url.origin;

  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider,
      options: {
        redirectTo: `${origin}/callbacks/oauth`,
      }
    });

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: error.status || 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        url: data.url
      }),
      { status: 200 }
    );
  } catch(error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
