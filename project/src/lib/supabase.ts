import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://');

let supabase: any;

if (!isSupabaseConfigured) {
  console.warn('Supabase is not properly configured. Please set up your environment variables.');
  // Create a mock client that won't cause errors but will remind users to configure Supabase
  const mockSupabase = {
    auth: {
      signUp: () => Promise.reject(new Error('Please configure Supabase first')),
      signInWithPassword: () => Promise.reject(new Error('Please configure Supabase first')),
      signOut: () => Promise.reject(new Error('Please configure Supabase first')),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => Promise.reject(new Error('Please configure Supabase first')),
      insert: () => Promise.reject(new Error('Please configure Supabase first')),
      update: () => Promise.reject(new Error('Please configure Supabase first')),
      delete: () => Promise.reject(new Error('Please configure Supabase first'))
    })
  };
  
  supabase = mockSupabase as any;
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      notes: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          color: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          user_id?: string;
          created_at?: string;
        };
      };
    };
  };
};