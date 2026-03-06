import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();

    // Check if user is authenticated via middleware
    if (!locals.user) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not logged in." }),
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('Quotes')
      .insert(body)
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
