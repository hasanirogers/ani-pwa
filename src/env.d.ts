/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    supabase: import("@supabase/ssr").SupabaseClient;
    user?: import("@supabase/supabase-js").User;
    profile: IProfile
  }
}
