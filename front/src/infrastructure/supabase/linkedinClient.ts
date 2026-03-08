import { createClient } from '@supabase/supabase-js';

// Cliente Supabase específico para LinkedIn Champion
// Usa variáveis de ambiente específicas ou fallback para as padrão
const LINKEDIN_SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_LINKEDIN_URL || 
  import.meta.env.VITE_SUPABASE_URL;

const LINKEDIN_SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_LINKEDIN_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const linkedinSupabase = createClient(
  LINKEDIN_SUPABASE_URL, 
  LINKEDIN_SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-linkedin-auth-token', // Unique storage key to avoid conflicts
    }
  }
);
