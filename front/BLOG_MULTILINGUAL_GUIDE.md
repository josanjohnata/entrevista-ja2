# 🌍 Guia de Blog Multilíngue - FoxApply

## 📋 Visão Geral

O sistema de blog do FoxApply suporta **3 idiomas**:
- 🇧🇷 **Português** (pt)
- 🇺🇸 **Inglês** (en)
- 🇪🇸 **Espanhol** (es)

Os posts são **automaticamente filtrados** pelo idioma do usuário, detectado através do sistema i18n.

---

## 📝 Como Publicar um Artigo

### 1. **Estrutura de um Post**

Cada post deve ter as seguintes propriedades:

```typescript
{
  slug: '2026-01-26-titulo-do-post-pt',       // YYYY-MM-DD-slug-IDIOMA
  locale: 'pt',                                // 'pt', 'en' ou 'es'
  title: 'Título do Post',
  excerpt: 'Resumo breve do post (150-200 caracteres)',
  content: `Conteúdo em Markdown...`,
  coverImage: '/images/blog/capa.jpg',        // Opcional
  date: '2026-01-26',                          // YYYY-MM-DD
  author: {
    name: 'Equipe FoxApply',
    avatar: '/images/fox-mascot.png',
  },
  tags: ['Tag1', 'Tag2', 'Tag3'],             // 2-5 tags
  readTime: 8,                                 // minutos (calculado automaticamente)
  published: true,                             // false para rascunho
  translations: {                              // Links para traduções
    pt: '2026-01-26-titulo-do-post-pt',
    en: '2026-01-26-post-title-en',
    es: '2026-01-26-titulo-del-post-es',
  },
}
```

---

## 🔤 Convenção de Nomenclatura dos Slugs

### Formato:
```
YYYY-MM-DD-slug-IDIOMA
```

### Exemplos:
- 🇧🇷 Português: `2026-01-26-automatizar-busca-emprego-pt`
- 🇺🇸 Inglês: `2026-01-26-automate-job-search-en`
- 🇪🇸 Espanhol: `2026-01-26-automatizar-busqueda-empleo-es`

### Regras:
- ✅ Sempre incluir a data no formato `YYYY-MM-DD`
- ✅ Usar hífens para separar palavras (kebab-case)
- ✅ Terminar com o código do idioma: `-pt`, `-en`, `-es`
- ✅ Manter consistência entre traduções (mesma data)

---

## 🌐 Publicando em Múltiplos Idiomas

### Passo a Passo:

#### 1. **Crie o Post em Português**

Edite o arquivo `/front/src/lib/blog/blogPosts.ts`:

```typescript
{
  slug: '2026-01-27-meu-novo-post-pt',
  locale: 'pt',
  title: 'Meu Novo Post Incrível',
  excerpt: 'Este é um post sobre como fazer X, Y e Z de forma eficiente.',
  content: `
# Meu Novo Post Incrível

Conteúdo completo aqui em **Markdown**.

## Seção 1
...
  `,
  coverImage: '/images/blog/meu-post.jpg',
  date: '2026-01-27',
  author: {
    name: 'Equipe FoxApply',
    avatar: '/images/fox-mascot.png',
  },
  tags: ['Dicas', 'Produtividade', 'Carreira'],
  readTime: 6,
  published: true,
  translations: {
    pt: '2026-01-27-meu-novo-post-pt',
    en: '2026-01-27-my-new-post-en',
    es: '2026-01-27-mi-nuevo-post-es',
  },
}
```

#### 2. **Crie a Versão em Inglês**

```typescript
{
  slug: '2026-01-27-my-new-post-en',
  locale: 'en',
  title: 'My Awesome New Post',
  excerpt: 'This is a post about how to do X, Y and Z efficiently.',
  content: `
# My Awesome New Post

Full content here in **Markdown**.

## Section 1
...
  `,
  coverImage: '/images/blog/meu-post.jpg',  // mesma imagem
  date: '2026-01-27',                        // mesma data
  author: {
    name: 'FoxApply Team',
    avatar: '/images/fox-mascot.png',
  },
  tags: ['Tips', 'Productivity', 'Career'],
  readTime: 6,
  published: true,
  translations: {
    pt: '2026-01-27-meu-novo-post-pt',
    en: '2026-01-27-my-new-post-en',
    es: '2026-01-27-mi-nuevo-post-es',
  },
}
```

#### 3. **Crie a Versão em Espanhol**

```typescript
{
  slug: '2026-01-27-mi-nuevo-post-es',
  locale: 'es',
  title: 'Mi Nuevo Post Increíble',
  excerpt: 'Este es un post sobre cómo hacer X, Y y Z de forma eficiente.',
  content: `
# Mi Nuevo Post Increíble

Contenido completo aquí en **Markdown**.

## Sección 1
...
  `,
  coverImage: '/images/blog/meu-post.jpg',  // mesma imagem
  date: '2026-01-27',                        // mesma data
  author: {
    name: 'Equipo FoxApply',
    avatar: '/images/fox-mascot.png',
  },
  tags: ['Consejos', 'Productividad', 'Carrera'],
  readTime: 6,
  published: true,
  translations: {
    pt: '2026-01-27-meu-novo-post-pt',
    en: '2026-01-27-my-new-post-en',
    es: '2026-01-27-mi-nuevo-post-es',
  },
}
```

---

## 🎯 Dicas Importantes

### ✅ O que fazer:
- Traduzir **título**, **excerpt**, **content** e **tags**
- Usar o **mesmo slug base**, mudando apenas o idioma no final
- Manter a **mesma data** em todas as traduções
- Usar a **mesma imagem de capa** (ou versão localizada)
- Linkar todas as traduções no campo `translations`

### ❌ O que NÃO fazer:
- ❌ Publicar apenas em um idioma (sempre publique nas 3 línguas)
- ❌ Usar datas diferentes para o mesmo post
- ❌ Esquecer de adicionar o campo `translations`
- ❌ Usar caracteres especiais no slug (ã, é, ñ, etc.)

---

## 📸 Adicionando Imagens

### Estrutura de Pastas:

```
front/public/images/blog/
├── automatizar-busca-emprego.jpg      # Capa do post
├── linkedin-champion-cover.jpg        # Capa do post
└── posts/                             # Imagens dentro dos posts
    ├── 2026-01-27/
    │   ├── screenshot-1.png
    │   └── grafico.png
    └── 2026-01-28/
        └── exemplo.jpg
```

### No Markdown:

```markdown
![Descrição da imagem](/images/blog/posts/2026-01-27/screenshot-1.png)
```

### Boas Práticas:
- **Comprimir imagens** antes de adicionar (TinyPNG, etc.)
- **Usar WebP** quando possível
- **Dimensões recomendadas**:
  - Cover image: 1200x630px
  - Imagens no conteúdo: max 800px largura

---

## 🔄 Como Funciona a Detecção de Idioma

1. O sistema detecta o idioma do usuário através do `i18n.language`
2. Mapeia para um dos 3 idiomas suportados:
   - `pt-BR`, `pt` → `pt`
   - `es-ES`, `es` → `es`
   - Qualquer outro → `en` (padrão)
3. Filtra automaticamente os posts pelo idioma detectado
4. O usuário vê apenas posts no seu idioma

---

## 📊 Exemplo Completo

Veja o arquivo `/front/src/lib/blog/blogPosts.ts` para ver **3 posts completos** já traduzidos nos 3 idiomas!

---

## 🚀 Próximos Passos

### Funcionalidades Futuras (Opcional):

1. **Seletor de Idioma** no cabeçalho do blog
2. **Links para traduções** em cada post
3. **Detecção automática de idioma incompleto** (avisar se falta tradução)
4. **SEO melhorado** com hreflang tags
5. **Sitemap multilíngue**

---

## 📞 Dúvidas?

Qualquer dúvida sobre o sistema de blog multilíngue, consulte:
- `/front/src/lib/blog/types.ts` - Tipos TypeScript
- `/front/src/lib/blog/blogApi.ts` - API e funções
- `/front/src/lib/blog/blogPosts.ts` - Posts de exemplo

---

**Desenvolvido com 🦊 pela Equipe FoxApply**

