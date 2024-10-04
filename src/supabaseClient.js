import { createClient } from '@supabase/supabase-js';

// Supabase project credentials
const supabaseUrl = 'https://wggjgglcouasckwzhine.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnZ2pnZ2xjb3Vhc2Nrd3poaW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2NTUwNDYsImV4cCI6MjA0MzIzMTA0Nn0.EcPAHu7RSwt4D7kRorcyFJ7eqhCex3ldvgNDBm9-dbM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);