// src/SupabaseClient.jsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY;

// Create a Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);