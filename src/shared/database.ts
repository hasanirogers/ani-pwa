import { createClient, type AuthFlowType } from "@supabase/supabase-js";
import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

const projectID = import.meta.env.SUPABASE_PROJECT_ID;
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
  // Debug: Check what cookies are available
  const projectName = import.meta.env.SUPABASE_PROJECT_ID || 'empjkbtwrtuaitcrxxsa';
  const accessTokenCookie = cookies.get(`sb-${projectName}-auth-token`)?.value;
  const refreshTokenCookie = cookies.get(`sb-${projectName}-auth-token-refresh`)?.value;

  console.log('=== COOKIE DEBUG ===');
  console.log('Project ID:', import.meta.env.SUPABASE_PROJECT_ID);
  console.log('Access token cookie exists:', !!accessTokenCookie);
  console.log('Refresh token cookie exists:', !!refreshTokenCookie);
  console.log('Access token cookie length:', accessTokenCookie?.length || 0);
  console.log('Refresh token cookie length:', refreshTokenCookie?.length || 0);

  return createServerClient(
    `https://${projectID}.supabase.co`,
    supabaseKey,
    {
      cookies: {
        get: (key) => {
          const value = cookies.get(key)?.value;
          console.log(`Getting cookie ${key}:`, value ? `exists (${value.length} chars)` : 'missing');
          return value;
        },
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
      auth: {
        flowType: 'pkce' as AuthFlowType,
        persistSession: false, // Don't persist session on server side
        autoRefreshToken: false, // Don't auto refresh on server side
        detectSessionInUrl: false,
      },
    }
  );
}
