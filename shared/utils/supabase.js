import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.SUPABASE_URL || 'https://ubpamxjoyiitufaqitrk.supabase.co',
  process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVicGFteGpveWlpdHVmYXFpdHJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzNjQ0ODMsImV4cCI6MjA2Nzk0MDQ4M30.1WFxYbA9kykwZf5elEwNVvBLh2rQ0BPmbhzJpaPK6a0'
); 