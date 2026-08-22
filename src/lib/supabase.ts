import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "https://oglbbffvqyqrlctkycfs.supabase.co";

export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_vkY4h8-zpw2QXr49d0EyPA_yXf2DeRV";

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && SUPABASE_ANON_KEY && !SUPABASE_ANON_KEY.includes("YOUR_")
);

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
