import { createClient, type AuthFlowType } from "@supabase/supabase-js";

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
