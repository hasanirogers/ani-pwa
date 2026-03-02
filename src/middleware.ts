import { defineMiddleware } from 'astro:middleware';
import { supabaseServerClient } from './shared/database';

export const onRequest = defineMiddleware(async ({ locals, url, cookies, redirect }, next) => {
  // Debug: Check what locals actually is
  console.log('Locals type:', typeof locals);
  console.log('Locals value:', locals);

  const supabase = supabaseServerClient(cookies);

  // Get session and user data securely on the server
  const { data: { session } } = await supabase.auth.getSession();

  if (session && session.user) {
    // Store the user in locals for use in Astro components/endpoints
    console.log('Setting user on locals...');
    locals.user = session.user;
    console.log('User set successfully');
  }

  return next();
});
