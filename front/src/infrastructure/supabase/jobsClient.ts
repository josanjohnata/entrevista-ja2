import { createClient } from '@supabase/supabase-js';

// Cliente Supabase específico para Vagas Recomendadas (Jobs)
// Usa variáveis de ambiente específicas ou fallback para as padrão
const JOBS_SUPABASE_URL = 
  import.meta.env.VITE_SUPABASE_JOBS_URL || 
  import.meta.env.VITE_SUPABASE_URL;

const JOBS_SUPABASE_ANON_KEY = 
  import.meta.env.VITE_SUPABASE_JOBS_ANON_KEY || 
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Storage key única para evitar conflito com outros clientes Supabase
const jobsStorageKey = 'sb-jobs-auth-token';

export const jobsSupabase = createClient(
  JOBS_SUPABASE_URL, 
  JOBS_SUPABASE_ANON_KEY, 
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
      storageKey: jobsStorageKey,
    },
    global: {
      headers: {
        'x-client-info': 'jobs-client',
      },
    },
  }
);
