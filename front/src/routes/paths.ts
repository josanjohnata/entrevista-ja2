/**
 * Rotas da aplicação em português (URLs amigáveis).
 * Use estas constantes em vez de strings para links e navegação.
 */
export const ROUTES = {
  HOME: '/',
  PCD: '/pcd',
  LOGIN: '/entrar',
  PLANOS: '/planos',
  PAGAMENTO: '/pagamento',
  PAGAMENTO_PCD: '/pagamento-pcd',
  PAGAMENTO_PENDENTE: '/pagamento-pendente',
  POLITICA_PRIVACIDADE: '/politica-de-privacidade',
  REEMBOLSO: '/reembolso',
  BLOG: '/blog',
  BLOG_POST: (slug: string) => `/blog/${slug}`,
  INICIO: '/inicio',
  CURRICULO_TURBO: '/curriculo-turbo',
  FILTRAR_VAGAS: '/filtrar-vagas',
  LINKEDIN_CAMPEAO: '/linkedin-campeao',
  VAGAS_RECOMENDADAS: '/vagas-recomendadas',
  RESULTADOS: '/resultados',
  PERFIL: '/perfil',
  ADMIN_PAINEL_INDICACOES: '/admin/painel-indicacoes',
} as const;
