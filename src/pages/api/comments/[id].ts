import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../shared/database";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const quote_id = params.id;

  try {
    const { data, error } = await supabase
    .from('Comments')
    .select(`
      id,
      created_at,
      comment,
      quote_id,
      profile_id,
      user:Profiles (id, display_name, email, avatar)
    `)
    .eq('quote_id', quote_id);

    const { data: { publicUrl: avatarBaseURL }} = supabase
      .storage
      .from('avatars')
      .getPublicUrl('');

    const comments = data?.map((comment: any) => {
      return {
        ...comment,
        user: {
          ...comment.user,
          avatar: !!comment.user.avatar ? `${avatarBaseURL}/${comment.user.avatar}` : null
        }
      }
    });

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get user.", error }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify(comments),
      { status: 200 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ params }) => {
  const comment_id = params.id;

  try {
    const { data, error } = await supabase
    .from('Comments')
    .delete()
    .eq('id', comment_id);

    if (error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to delete comment.", error }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Comment deleted successfully.', data }),
      { status: 200 }
    );
  } catch(error) {
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
