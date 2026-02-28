import { createClient } from "@supabase/supabase-js";

const projectID = import.meta.env.SUPABASE_PROJECT_ID;
const anonKey = import.meta.env.SUPABASE_ANON_KEY;
const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(`https://${projectID}.supabase.co`, anonKey);
export const supabaseAdmin = createClient(`https://${projectID}.supabase.co`, serviceRoleKey);
