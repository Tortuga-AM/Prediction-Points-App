// src/SupabaseClient.jsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://iyvitvgcjmonbraatjvm.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dml0dmdjam1vbmJyYWF0anZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTkzNDQsImV4cCI6MjA2Mzg5NTM0NH0.TtVob1P5Dlvnb9Hi-SnycETen-unEuTPpD_CKecFIkM";

// Create a Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);