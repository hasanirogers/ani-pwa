import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('Books')
      .insert({
        title: body.title,
        identifier: body.identifier,
        authors: body.authors,
      })
      .eq('identifier', body.identifier)
      .select('*')
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to update profile.", error }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Book created successfully.", data }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred."}),
      { status: 500 })
  }
}
