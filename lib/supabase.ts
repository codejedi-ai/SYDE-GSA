import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_time: string;
  location: string;
  attendees_expected: string;
  image_url: string | null;
  is_featured: boolean;
  is_past: boolean;
  created_at: string;
  updated_at: string;
};
