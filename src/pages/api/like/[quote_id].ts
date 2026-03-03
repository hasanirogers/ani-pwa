import type { APIRoute } from "astro";
import { supabaseAdmin } from "../../../shared/database";

export const prerender = false;
export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const { quote_id } = params;

    // Ensure we have a valid number for int8
    const numericId = Number(quote_id);
    if (isNaN(numericId)) {
       return new Response(JSON.stringify({ error: "Invalid Quote ID format" }), { status: 400 });
    }

    const body = await request.json();
    const { liked, likedBy } = body;

    // 1. Fetch current likes using supabaseAdmin
    const { data: existingQuote, error: fetchError } = await supabaseAdmin
      .from('Quotes')
      .select('likes')
      .eq('id', numericId)
      .maybeSingle();

    if (fetchError || !existingQuote) {
      return new Response(
        JSON.stringify({ success: false, message: "Quote not found" }),
        { status: 404 }
      );
    }

    // 2. Atomic-like array management
    const currentLikes = existingQuote.likes || [];
    const updatedLikes = liked
      ? Array.from(new Set([...currentLikes, likedBy])) // Add & deduplicate
      : currentLikes.filter((id: any) => id !== likedBy); // Remove

    // 3. Update using the numeric ID
    const { error: updateError } = await supabaseAdmin
      .from('Quotes')
      .update({ likes: updatedLikes })
      .eq('id', numericId);

    if (updateError) {
      return new Response(
        JSON.stringify({ success: false, message: updateError.message }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Updated successfully." }),
      { status: 200 }
    );
  } catch(error: any) {
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error" }),
      { status: 500 });
  }
}
