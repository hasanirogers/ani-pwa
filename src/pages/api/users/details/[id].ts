import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabase } from "../../../../shared/database";
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

export const PUT: APIRoute = async ({ params, request }) => {
  try {
    const userId = Number(params.id);
    const body = await request.json();

    delete body.filepond;

    // Get auth token from cookies
    const cookies = request.headers.get('cookie') || '';
    const tokenMatch = cookies.match(/sb-[^-]+-auth-token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;
    console.log('Extracted token from cookies:', token ? 'found' : 'not found');

    // Debug: Check what's current user's auth.uid() is
    const { data: { user } } = await supabase.auth.getUser(token || undefined);
    console.log('Auth user UUID:', user?.id);
    console.log('Updating profile ID:', userId);

    // Debug: Check the profile we're trying to update
    const { data: profileCheck, error: checkError } = await supabase
      .from('Profiles')
      .select('id, uuid')
      .eq('id', userId)
      .single();

    console.log('Profile check:', profileCheck);
    console.log('Check error:', checkError);

    const { error: updateError } = await supabase
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

