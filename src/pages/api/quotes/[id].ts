import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";
import { determineAvatar } from "../../../shared/utilities";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const { id } = params;
    const { data: quote, error } = await supabase
      .from('Quotes')
      .select(`
        id,
        created_at,
        quote,
        requote,
        page,
        note,
        private,
        likes,
        requotes,
        book:Books (id, title, identifier, authors),
        user:Profiles (*)
      `)
      .eq('id', id)
      .single();

    if (quote) {
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl('');

      const user = Array.isArray(quote.user) ? quote.user[0] : quote.user;
      const response = {
        ...quote,
        user: {
          ...user,
          // avatar: `${publicUrl}/${user.avatar}`
          avatar: determineAvatar(publicUrl, user.avatar, user.avatar_url)
        }
      };

      return new Response(
        JSON.stringify(response),
        { status: 200 }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: "Failed to get quotes.", error }),
      { status: 400 }
    );
  } catch(error) {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { id } = params;
    const body = await request.json();

    const { data: existingQuote } = await supabase
      .from('Quotes')
      .select('requotes')
      .eq('id', id)
      .single();

    const { error } = await supabase
      .from('Quotes')
      .update({
        requotes: [...existingQuote?.requotes, body.requotedBy]
      })
      .eq('id', id);

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to update quote.", error }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Updated successfully." }),
      { status: 200 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ params, request, locals }) => {
  const quote_id = params.id;
  const body = await request.json();

  // Check if user is authenticated via middleware
  if (!locals.user) {
    return new Response(
      JSON.stringify({ success: false, message: "You are not logged in." }),
      { status: 401 }
    );
  }

  try {
    console.log('Attempting to delete quote with ID:', quote_id);
    console.log('Authenticated user:', locals.user?.id);

    // First check if quote exists and who owns it
    const { data: existingQuote, error: checkError } = await supabase
      .from('Quotes')
      .select('id, user_id')
      .eq('id', quote_id)
      .single();

    console.log('Existing quote:', existingQuote, 'check error:', checkError);

    if (checkError || !existingQuote) {
      console.log('Quote not found');
      return new Response(
        JSON.stringify({ success: false, message: "Quote not found." }),
        { status: 404 }
      );
    }

    const { data: deletedQuote, error } = await supabase
      .from('Quotes')
      .delete()
      .eq('id', quote_id)
      .select();

    console.log('Delete result - deletedQuote:', deletedQuote, 'error:', error);

    if (error || !deletedQuote || deletedQuote.length === 0) {
      console.log('Delete failed or no records found');
      return new Response(
        JSON.stringify({ success: false, message: "Failed to delete quote.", error }),
        { status: 500 }
      );
    }

    // Only handle original quote if this is a requote
    if (body.isRequote) {
      const { data: originalQuote } = await supabase
        .from('Quotes')
        .select('requotes')
        .eq('id', body.originalQuoteId)
        .single();

      if (!originalQuote) {
        return new Response(
          JSON.stringify({ success: false, message: "Original quote not found" }),
          { status: 404 }
        );
      }

      const { error: originalQuoteError } = await supabase
        .from('Quotes')
        .update({
          requotes: originalQuote?.requotes?.filter((requotedUser: number) => requotedUser !== body.requotedBy),
        })
        .eq('id', body.originalQuoteId);

      if (originalQuoteError) {
        console.log(originalQuoteError);
        return new Response(
          JSON.stringify({ success: false, message: "Failed to remove requote user.", error: originalQuoteError }),
          { status: 500 }
        );
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Quote deleted successfully.', data: deletedQuote }),
      { status: 200 } as any
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
