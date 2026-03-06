import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabaseServerClient } from "../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, cookies }) => {
  try {
    const body = await request.json();

    // Check if user is authenticated via middleware
    if (!locals.user) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not logged in." }),
        { status: 401 }
      );
    }

    // Create server client with cookies
    const supabase = supabaseServerClient(cookies);

    const { data, error } = await supabase
      .from('Quotes')
      .insert({
        ...body,
        user_id: locals.user.id, // Add user_id from authenticated user
      })
      .select('*')
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to create quote.", error }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Quote created successfully.", data }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred."}),
      { status: 500 })
  }
}
