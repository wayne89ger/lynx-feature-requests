// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://nalbepqgfwqaiwkxktlj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5hbGJlcHFnZndxYWl3a3hrdGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgzNDI2NTEsImV4cCI6MjA1MzkxODY1MX0.qKnZZUYhDcVw0FhB0EoIXYasewU23BCKxy7x0fyHdiI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);