import { createClient, type AuthFlowType } from "@supabase/supabase-js";
import { createServerClient } from '@supabase/ssr';
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

export const supabaseServerClient = (cookies: AstroCookies) => {
  // Get auth tokens from cookies
  const accessToken = cookies.get(`sb-${projectID}-auth-token`)?.value;
  const refreshToken = cookies.get(`sb-${projectID}-auth-token-refresh`)?.value;

  const client = createServerClient(
    `https://${projectID}.supabase.co`,
    supabaseKey,
    {
      cookies: {
        get: (key) => cookies.get(key)?.value,
        set: (key, value, options) => {
          // Don't set cookies from server client to avoid conflicts
          // We'll let the auth callback handle cookie setting
        },
        remove: (key, options) => {
          // Don't remove cookies from server client to avoid conflicts
        },
      },
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

  // Manually set session if we have tokens
  if (accessToken) {
    client.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken || ''
    }).catch(() => {
      // Ignore session setting errors to avoid breaking the client
    });
  }

  return client;
}
