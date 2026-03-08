import { createClient, type AuthFlowType } from "@supabase/supabase-js";
import type { AstroCookies } from 'astro';

const projectID = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;
const supabaseKey = import.meta.env.SUPABASE_API_KEY_PUBLISHABLE;
const supabaseSecret = import.meta.env.SUPABASE_API_KEY_SECRET;
const options = {
  auth: {
    flowType: 'pkce' as AuthFlowType,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  }
}

export const supabase = createClient(`https://${projectID}.supabase.co`, supabaseKey, options);
export const supabaseAdmin = createClient(`https://${projectID}.supabase.co`, supabaseSecret);

export const supabaseServerClient = async (cookies: AstroCookies) => {
  // Get auth tokens from cookies
  const accessToken = cookies.get(`sb-${projectID}-auth-token`)?.value;
  const refreshToken = cookies.get(`sb-${projectID}-auth-token-refresh`)?.value;

  // If no access token, return client without auth
  if (!accessToken) {
    return createClient(
      `https://${projectID}.supabase.co`,
      supabaseSecret,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false,
        }
      }
    );
  }

  // Check if token is expired
  try {
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);

    // If token is expired and we have a refresh token, try to refresh
    if (payload.exp && payload.exp < now && refreshToken) {
      const tempClient = createClient(
        `https://${projectID}.supabase.co`,
        supabaseSecret,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false,
          }
        }
      );

      const { data, error } = await tempClient.auth.refreshSession({ refresh_token: refreshToken });

      if (!error && data.session?.access_token) {
        // Update the access token cookie
        cookies.set(`sb-${projectID}-auth-token`, data.session.access_token, {
          path: "/",
          httpOnly: true,
          secure: true,
          sameSite: "lax" as const,
          maxAge: 604800,
        });

        // Update refresh token if provided
        if (data.session.refresh_token) {
          cookies.set(`sb-${projectID}-auth-token-refresh`, data.session.refresh_token, {
            path: "/",
            httpOnly: true,
            secure: true,
            sameSite: "lax" as const,
            maxAge: 604800,
          });
        }

        return createClient(
          `https://${projectID}.supabase.co`,
          supabaseSecret,
          {
            auth: {
              persistSession: false,
              autoRefreshToken: false,
              detectSessionInUrl: false,
            },
            global: {
              headers: {
                Authorization: `Bearer ${data.session.access_token}`
              }
            },
          }
        );
      }
    }
  } catch (error) {
    console.error('Error checking token expiration:', error);
  }

  // Use regular createClient with service role key
  const client = createClient(
    `https://${projectID}.supabase.co`,
    supabaseSecret,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        headers: accessToken ? {
          Authorization: `Bearer ${accessToken}`
        } : {}
      },
    }
  );

  return client;
}
