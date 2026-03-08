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

    // Use server client with proper auth context
    // The server client should automatically pick up auth from cookies
    const supabase = await supabaseServerClient(cookies);

    const { data, error } = await supabase
      .from('Quotes')
      .insert({
        ...body,
        user_id: locals.profile?.id || locals.user.id, // Use profile.id (integer) if available, fallback to user.id
      })
      .select('*')
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to create quote.", error }),
        { status: 400 }
      );
    }

    const { data: userData, error: userError } = await supabase
      .from('Profiles')
      .select('*')
      .eq('id', locals.profile?.id || locals.user.id)
      .single();

    if (userError) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get user data.", error: userError }),
        { status: 400 }
      );
    }

    const {data: bookData, error: bookError} = await supabase
      .from('Books')
      .select('*')
      .eq('id', data.book_id)
      .single();

    if (bookError) {
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get book data.", error: bookError }),
        { status: 400 }
      );
    }

    const { data: { publicUrl } } = locals.profile?.avatar
      ? supabase
          .storage
          .from('avatars')
          .getPublicUrl(locals.profile.avatar)
      : { data: { publicUrl: null } };

    const newQuoteData = {
      ...data,
      user: {
        ...userData,
        avatar: !!locals.profile?.avatar ? publicUrl : locals.profile?.avatar_url || null
      },
      book: bookData
    };

    return new Response(
      JSON.stringify({ success: true, message: "Quote created successfully.", data: newQuoteData }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred."}),
      { status: 500 })
  }
}
