import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase, supabaseAdmin } from "../../../../shared/database";
import { determineAvatar } from "../../../../shared/utilities";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  try {
    const userId = Number(params.id);

    const { data: profile, error: profileError } = await supabase
      .from('Profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError ) {
      console.log({ errors: { profileError } });
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get profile.", error: profileError }),
        { status: 500 }
      );
    }

    const { data: books, error: booksError } = await supabase
      .from('Books')
      .select('*')
      .in('id', profile.book_ids);

    if (booksError ) {
      console.log({ errors: { booksError } });
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get profile.", error: booksError }),
        { status: 500 }
      );
    }

    const { data: quotes, error: quotesError, count: quotesCount } = await supabase
      .from('Quotes')
      .select('*', { count: 'exact'})
      .eq('user_id', userId);

    if (quotesError ) {
      console.log({ errors: { quotesError } });
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get profile.", error: quotesError }),
      { status: 500 }
      );
    }

    const { data: followers, error: followersError } = await supabase
      .from('Profiles')
      .select('*')
      .filter('following', 'cs', userId);

    if (followersError ) {
      console.log({ errors: { followersError } });
      return new Response(
        JSON.stringify({ success: false, message: "Failed to get profile.", error: followersError }),
      { status: 500 }
      );
    }

    const followerCount = followers?.length ?? 0;

    const { data: { publicUrl } } = supabase
      .storage
      .from('avatars')
      .getPublicUrl(profile.avatar || '');

    const data = {
      ...profile,
      books,
      counts: { quotes: quotesCount, followers: followerCount, following: profile.following?.length || 0 },
      // avatar: profile.avatar ? publicUrl : null
      avatar: determineAvatar(publicUrl, profile.avatar, profile.avatar_url)
    };

    return new Response(
      JSON.stringify(data),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const PUT: APIRoute = async ({ params, request, locals }) => {
  try {
    const userId = Number(params.id);
    const body = await request.json();

    delete body.filepond;

    // Check if user is authenticated via middleware
    if (!locals.user) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not logged in." }),
        { status: 401 }
      );
    }

    // Use admin client to bypass RLS for profile updates
    const { error: updateError } = await supabaseAdmin
      .from('Profiles')
      .update(body)
      .eq('id', userId)
      .single()

    if (updateError) {
      console.error(updateError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to update profile.", error: updateError }),
        { status: 400 }
      );
    }

    const { data } = await supabase
      .from('Profiles')
      .select('*')
      .eq('id', userId)
      .single()

    return new Response(
      JSON.stringify({ success: true, message: "Profile updated successfully.", data }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred."}),
      { status: 500 })
  }
}

