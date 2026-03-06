/// <reference types="astro/client" />

interface AppUser {
  id: string | number;
  uuid: string;
  email: string;
  aud: string;
  created_at: string;
  user_metadata: any;
  app_metadata: any;
}

declare namespace App {
  interface Locals {
    supabase: import("@supabase/ssr").SupabaseClient;
    user?: AppUser;
    profile: IProfile
  }
}
