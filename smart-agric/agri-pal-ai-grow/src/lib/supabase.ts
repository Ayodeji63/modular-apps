// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

// Handle both Next.js and Vite environment variables
const supabaseUrl =
  import.meta.env.VITE_PUBLIC_SUPABASE_URL ||
  (typeof window !== "undefined" &&
    (window as any).env?.VITE_PUBLIC_SUPABASE_URL) ||
  "";

const supabaseAnonKey =
  import.meta.env.VITE_PUBLIC_SUPABASE_ANON_KEY ||
  (typeof window !== "undefined" &&
    (window as any).env?.VITE_PUBLIC_SUPABASE_ANON_KEY) ||
  "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "Supabase environment variables not found. Using fallback configuration for development."
  );
  // Don't throw error in development - just warn
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
