import { createClient } from '@supabase/supabase-js';

// Cliente Supabase específico para Cover Letter
// Usa variáveis de ambiente específicas ou fallback para as padrão
const COVER_LETTER_SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_COVER_LETTER_URL || 
  import.meta.env.VITE_SUPABASE_URL;

const COVER_LETTER_SUPABASE_PUBLISHABLE_KEY = 
  import.meta.env.VITE_SUPABASE_COVER_LETTER_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const coverLetterSupabase = createClient(
  COVER_LETTER_SUPABASE_URL, 
  COVER_LETTER_SUPABASE_PUBLISHABLE_KEY, 
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-cover-letter-auth-token', // Unique storage key to avoid conflicts
    }
  }
);

