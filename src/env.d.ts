/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    supabase: import("@supabase/ssr").SupabaseClient;
    user?: import("@supabase/supabase-js").User;
  }
}

declare global {
  interface Window {
    user?: import("../shared/interfaces").IProfile;
  }
}
