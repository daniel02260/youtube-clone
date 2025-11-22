import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ebqhcyduohnvssjocfdh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVicWhjeWR1b2hudnNzam9jZmRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4MjMyNTYsImV4cCI6MjA3OTM5OTI1Nn0.U4nIJt9A2GcXy723eJZ7W_tDr73y04_ghTF1cdAQsVk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)