import { createClient, type AuthFlowType } from "@supabase/supabase-js";

const projectID = import.meta.env.SUPABASE_PROJECT_ID;
const anonKey = import.meta.env.SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const options = {
  auth: {
    flowType: 'pkce' as AuthFlowType,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  }
}

export const supabase = createClient(`https://${projectID}.supabase.co`, anonKey, options);
export const supabaseAdmin = createClient(`https://${projectID}.supabase.co`, serviceRoleKey);
