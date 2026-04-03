import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bfqsxipdnkdmqmxavval.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmcXN4aXBkbmtkbXFteGF2dmFsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgwMDM1MjgsImV4cCI6MjA3MzU3OTUyOH0.CaD7WRVwCuDcvth6V_efqQndEwFi2hVKAC6jS8pCkbQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);