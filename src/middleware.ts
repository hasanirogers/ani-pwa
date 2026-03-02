import { defineMiddleware } from 'astro:middleware';
import { supabaseServerClient } from './shared/database';

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {
  const supabase = supabaseServerClient(cookies);

  // Get session and user data securely on the server
  const { data: { session } } = await supabase.auth.getSession();

  // if (!session) {
  //   // Redirect to sign-in page if not authenticated
  //   return redirect('/signin');
  // }
  // // Store the user in locals for use in Astro components/endpoints
  // locals.user = session.user;

  return next();
});
