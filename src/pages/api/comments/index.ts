import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase, supabaseServerClient } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const quoteId = url.searchParams.get('quoteId');

  try {
    const { data, error } = await supabase
    .from('Comments')
    .select('*')
    .eq('id', quoteId);

    if (data) {
      return new Response(
        JSON.stringify(data),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Failed to get user.", error }),
      { status: 400 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const body = await request.json();

  if (!locals.user) {
    return new Response(
      JSON.stringify({ success: false, message: "You are not logged in." }),
      { status: 401 }
    );
  }

  const supabaseServer = await supabaseServerClient(cookies);

  try {
    const { data, error } = await supabaseServer
    .from('Comments')
    .insert({
      quote_id: body.quote_id,
      comment: body.comment,
      profile_id: body.profile_id,
    })
    .select('*')
    .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to create comment.", error }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Comment created successfully.", data }),
      { status: 200 }
    );

  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
