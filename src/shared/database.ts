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
  return createServerClient(
    `https://${projectID}.supabase.co`,
    supabaseKey,
    {
      cookies: {
        get: (key) => cookies.get(key)?.value,
        set: (key, value, options) => cookies.set(key, value, options),
        remove: (key, options) => cookies.delete(key, options),
      },
    }
  );
}
