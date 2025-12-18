import { createClient } from '@supabase/supabase-js'

// For Supabase Realtime to work, you need:
// 1. SUPABASE_URL - Your Supabase project URL
// 2. SUPABASE_ANON_KEY - Your Supabase anonymous/public key
// 
// Note: If using Supabase Realtime with existing PostgreSQL database,
// you may need to configure Supabase to point to your existing database
// or set up database replication to Supabase.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not set. Realtime features will not work.')
}

// Client-side Supabase client
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null

