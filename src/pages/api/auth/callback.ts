import type { APIRoute } from "astro";
import { supabase } from "../../../shared/database";

console.log('*** CALLBACK FILE LOADED ***');

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const body = await request.json();
  const code = body.code;

  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        const { access_token, refresh_token } = data.session;

        console.log('Session data received:', {
          hasAccessToken: !!access_token,
          hasRefreshToken: !!refresh_token,
          accessTokenLength: access_token?.length || 0,
          refreshTokenLength: refresh_token?.length || 0
        });

        const hostname = new URL(request.url).hostname;
        let domain = {};

        // For Vercel, don't set explicit domain to allow subdomain access
        if (hostname.includes('vercel.app')) {
          // Don't set domain - let browser handle it automatically
        } else if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
          domain = { domain: hostname };
        }

        // Use Supabase's proper cookie naming convention
        const projectName = import.meta.env.SUPABASE_PROJECT_ID || 'empjkbtwrtuaitcrxxsa';

        console.log('Setting cookies for hostname:', hostname);
        console.log('Project ID:', import.meta.env.SUPABASE_PROJECT_ID);

        // Set access token cookie
        if (access_token) {
          console.log('Setting access token cookie...');
          console.log('Access token type:', typeof access_token);
          console.log('Access token length:', access_token.length);
          console.log('Cookies object type:', typeof cookies);

          const cookieName = `sb-${projectName}-auth-token`;
          const cookieOptions = {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax" as const,
            maxAge: 3600,
            ...domain
          };

          console.log('Cookie name:', cookieName);
          console.log('Cookie options:', JSON.stringify(cookieOptions, null, 2));
          console.log('Hostname:', hostname);

          try {
            cookies.set(cookieName, access_token, cookieOptions);
            console.log('Access token cookie set successfully');

            // Verify it was set
            const verifyCookie = cookies.get(cookieName)?.value;
            console.log('Verification - cookie exists after setting:', !!verifyCookie);
            console.log('Verification - cookie length after setting:', verifyCookie?.length || 0);
          } catch (error) {
            console.error('Error setting access token cookie:', error);
          }
        } else {
          console.error('Access token is null, not setting cookie');
        }

        // Set refresh token cookie
        if (refresh_token) {
          console.log('Setting refresh token cookie...');
          cookies.set(`sb-${projectName}-auth-token-refresh`, refresh_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax",
            maxAge: 604800,
            ...domain
          });
          console.log('Refresh token cookie set successfully');
        } else {
          console.error('Refresh token is null, not setting cookie');
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
