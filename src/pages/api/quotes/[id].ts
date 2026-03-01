import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

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
        user:Profiles (id, display_name, email, avatar)
      `)
      .eq('id', id)
      .single();

    if (quote) {
      const { data: { publicUrl } } = supabase
        .storage
        .from('avatars')
        .getPublicUrl('');

      const response = {
        ...quote,
        user: {
          ...quote.user,
          avatar: `${publicUrl}/${quote.user.avatar}`
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

export const DELETE: APIRoute = async ({ params, request }) => {
  const quote_id = params.id;
  const body = await request.json();

  try {
    const { data, error } = await supabase
    .from('Quotes')
    .delete()
    .eq('id', quote_id);

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to delete quote.", error }),
        { status: 500 }
      );
    }

    const { data: originalQuote } = await supabase
      .from('Quotes')
      .select('requotes')
      .eq('id', body.originalQuoteId)
      .single();

    if (!originalQuote) {
      return new Response(
        JSON.stringify({ success: false, message: "Quote not found" }),
        { status: 404 }
      );
    }

    if (body.isRequote) {
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
      JSON.stringify({ success: true, message: 'Quote deleted successfully.', data }),
      { status: 200 } as any
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
