import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_KEY || ''; // Can be Anon or Service Role

if (!supabaseUrl || !supabaseKey) {
  console.warn('Missing Supabase Environment Variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);
