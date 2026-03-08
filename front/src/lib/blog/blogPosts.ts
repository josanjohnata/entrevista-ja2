import { BlogPost } from './types';

/**
 * Posts do Blog em múltiplos idiomas
 * 
 * Cada artigo está em um arquivo separado na pasta ./posts/
 * Este arquivo importa e combina todos os posts.
 */

import { posts as softSkillsPosts } from './posts/soft-skills-2026';
import { posts as acessibilidadePosts } from './posts/acessibilidade-no-trabalho';
import { posts as transicaoCarreiraPosts } from './posts/transio-de-carreira---passo-a-passo';
import { posts as linkedinCampeaoPosts } from './posts/linkedin-campeo---otimizao-de-perfil';
import { posts as curriculoCampeaoPosts } from './posts/currculo-campeo-2026---guia-completo';
import { posts as atsPosts } from './posts/ats---sistemas-de-rastreamento-de-candidatos';
import { posts as iaRecrutamentoPosts } from './posts/inteligncia-artificial-no-recrutamento';
import { posts as networkingPosts } from './posts/networking-estratgico';
import { posts as entrevistaPosts } from './posts/entrevista-de-emprego---perguntas-difceis';
import { posts as trabalhoRemotoPosts } from './posts/trabalho-remoto-vs-hbrido';
import { posts as empregabilidadePosts } from './posts/empregabilidade-40';

export const blogPosts: BlogPost[] = [
  ...softSkillsPosts,
  ...acessibilidadePosts,
  ...transicaoCarreiraPosts,
  ...linkedinCampeaoPosts,
  ...curriculoCampeaoPosts,
  ...atsPosts,
  ...iaRecrutamentoPosts,
  ...networkingPosts,
  ...entrevistaPosts,
  ...trabalhoRemotoPosts,
  ...empregabilidadePosts,
];
