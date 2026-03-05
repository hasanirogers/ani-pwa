import type { APIRoute } from "astro";
import 'dotenv/config'
import { supabaseAdmin } from "../../../shared/database";
import { getStripe } from "../../../shared/utilities";

export const prerender = false;

export const GET: APIRoute = async ({ request, locals, cookies }) => {
  try {
    if (!locals.user) {
      console.log('No user in locals, returning 401');
      return new Response(
        JSON.stringify({ success: false, message: "You are not logged in." }),
        { status: 401 }
      );
    }

    // Use admin client with service role key for database operations (no auth needed)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('Profiles')
      .select('*')
      .eq('uuid', locals.user.id)
      .single();

    if (profileError) {
      console.log('Profile error details:', profileError);
    }

    const { data: books, error: booksError } = await supabaseAdmin
      .from('Books')
      .select('*')
      .in('id', profile?.book_ids || []);

    console.log('Books query result:', { books: books?.length || 0, error: !!booksError });

    if (profile) {
      const data = { ...profile, books: books || [] };
      console.log('Returning successful response with', books?.length || 0, 'books');
      return new Response(
        JSON.stringify(data),
        { status: 200 }
      );
    }

    console.log('No profile found');
    return new Response(
      JSON.stringify({ success: false, message: "Profile not found." }),
      { status: 404 }
    );
  } catch(error) {
    console.error('ME endpoint error:', error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}

export const DELETE: APIRoute = async ({ request, locals, cookies }) => {
  try {
    // Check if user is available from middleware
    if (!locals.user) {
      return new Response(
        JSON.stringify({ success: false, message: "You are not logged in." }),
        { status: 401 }
      );
    }

    const body = await request.json();
    const { member_id } = body;

    // Use admin client for auth operations (no auth needed)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(locals.user.id);

    if (deleteError) {
      console.log(deleteError);
      return new Response(
        JSON.stringify({ success: false, message: deleteError.message, error: deleteError }),
        { status: 500 }
      )
    }

    // Delete user's avatar files
    // Step 1: List all files in user's folder
    const { data: files, error: listError } = await supabaseAdmin
      .storage
      .from('avatars')
      .list(`${locals.user.id}`, { limit: 100 });

    if (listError) {
      return new Response(JSON.stringify({ success: false, message: "Failed to list files.", error: listError }), {
        status: 500,
      });
    }

    // Step 2: Construct file paths for deletion
    const filePaths = files.map((file: any) => `${locals.user!.id.toString()}/${file.name}`);

    // Step 3: Delete files
    if (filePaths.length > 0) {
      const { error: storageError } = await supabaseAdmin
        .storage
        .from('avatars')
        .remove(filePaths);

      if (storageError) {
        console.log(storageError);
        return new Response(
          JSON.stringify({ success: false, message: "Failed to delete avatar.", error: storageError }),
          { status: 400 }
        );
      }
    }

    // Delete user's membership
    try {
      if (member_id) {
        const subscriptions = await getStripe().subscriptions.list({
          customer: member_id
        });

        const subscriptionIds = subscriptions.data.map(subscription => subscription.id);

        await Promise.all(
          subscriptionIds.map(id => getStripe().subscriptions.cancel(id))
        );
      }
    } catch(error) {
      console.log(error);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to delete membership.", error }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "User deleted successfully" }),
      { status: 200 }
    );
  } catch(error) {
    console.log(error);
    return new Response(
      JSON.stringify({ success: false, message: "An internal server error occurred." }),
      { status: 500 })
  }
}
