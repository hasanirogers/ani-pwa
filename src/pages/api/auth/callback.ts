import type { APIRoute } from "astro";
import { supabase } from "../../../shared/database";


export const POST: APIRoute = async ({ request, cookies }) => {
  const body = await request.json();
  const code = body.code;
  const projectName = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;

  console.log('Callback - Project name:', projectName);
  console.log('Callback - Code received:', !!code);

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      console.log('Callback - Exchange result:', { error: !!error, hasData: !!data, hasSession: !!data?.session });

      if (!error && data.session) {
        const { access_token, refresh_token } = data.session;

        console.log('Callback - Tokens:', { hasAccessToken: !!access_token, hasRefreshToken: !!refresh_token });

        // Use Supabase's proper cookie naming convention
        const projectName = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;

        // Set access token cookie
        if (access_token) {
          console.log('Setting access token cookie for project:', projectName);
          cookies.set(`sb-${projectName}-auth-token`, access_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax" as const,
            maxAge: 604800, // Match refresh token duration (7 days)
            // ...domain
          });
          console.log('Access token cookie set successfully');
        }

        // Set refresh token cookie
        if (refresh_token) {
          cookies.set(`sb-${projectName}-auth-token-refresh`, refresh_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax" as const,
            maxAge: 604800,
            // ...domain
          });
        }

        // Fetch user profile and set it in a non-httpOnly cookie for client access
        if (access_token) {
          try {
            const payload = JSON.parse(atob(access_token.split('.')[1]));
            const { data: profile, error: profileError } = await supabase
              .from('Profiles')
              .select('*')
              .eq('uuid', payload.sub)
              .single();

            if (!profileError && profile) {
              cookies.set('user-profile', JSON.stringify(profile), {
                path: "/",
                httpOnly: false,
                secure: true,
                sameSite: "lax" as const,
                maxAge: 604800,
                // ...domain
              });
            }
          } catch (profileError) {
            console.error('Error fetching profile:', profileError);
          }
        }

        // Return success response
        return new Response(
          JSON.stringify({ success: true, message: 'Login successful' }),
          { status: 200 }
        );
      } else {
        console.error('Error exchanging code for session:', error);
      }
    } catch (error) {
      console.error('Error exchanging code for session:', error);
    }
  }

  // Return error response
  return new Response(
    JSON.stringify({ success: false, message: 'Login failed, it appears no code was provided' }),
    { status: 400 }
  );
};
