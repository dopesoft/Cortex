import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Use StaffingBrain's Supabase instance for shared authentication
const SUPABASE_URL = "https://iirbgplemadugmnrykxu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcmJncGxlbWFkdWdtbnJ5a3h1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMyMDQxNjAsImV4cCI6MjA2ODc4MDE2MH0.4bGHHrLC4c71du8SD9w3_m6kypfr5mV6ydYdpvZzNJM";

// Create Supabase client with StaffingBrain's configuration for shared auth
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
}); 