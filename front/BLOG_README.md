# 📝 Blog FoxApply

Sistema de blog integrado ao FoxApply usando MDX (Markdown + React Components).

## 🎯 Características

- ✅ **MDX**: Markdown com suporte a componentes React
- ✅ **TypeScript**: Totalmente tipado
- ✅ **SEO Ready**: Metadata completa em cada post
- ✅ **Design Responsivo**: Adaptável a todos os dispositivos
- ✅ **Tags e Categorias**: Sistema de organização de conteúdo
- ✅ **Tempo de Leitura**: Calculado automaticamente
- ✅ **Script de Criação**: Ferramenta CLI para novos posts

## 📁 Estrutura de Diretórios

```
front/
  src/
    content/blog/              # Posts em MDX
    screens/BlogScreen/         # Componentes de tela
      components/
        BlogCard.tsx           # Card de post
      BlogScreen.tsx           # Lista de posts
      BlogPostScreen.tsx       # Post individual
    lib/blog/                  # Utilitários
      types.ts                 # Definições TypeScript
      mdxUtils.ts              # Funções Node.js
      blogApi.ts               # API client-side
  scripts/
    create-blog-post.js        # CLI para criar posts
```

## 🚀 Como Criar um Novo Post

### Método 1: Usando o Script (Recomendado)

```bash
npm run blog:new
```

O script irá perguntar:
- Título do post
- Resumo (excerpt)
- Tags
- Autor

E criará automaticamente um arquivo MDX com template pronto!

### Método 2: Manual

1. Crie um arquivo na pasta `src/content/blog/`
2. Nome do arquivo: `YYYY-MM-DD-slug-do-post.mdx`
3. Use o template abaixo:

```mdx
---
title: "Seu Título Aqui"
excerpt: "Breve descrição do post..."
date: "2026-01-24"
author:
  name: "Seu Nome"
  avatar: "/images/avatar.png"
tags: ["Tag1", "Tag2", "Tag3"]
coverImage: "/blog/cover-image.jpg"
published: true
---

# Título Principal

Seu conteúdo em Markdown aqui...

## Seção 2

Mais conteúdo...

### Subseção

- Lista item 1
- Lista item 2

**Negrito** e *itálico*

[Links](https://exemplo.com)

```codigo
// Blocos de código
console.log('Hello World');
```

---

*Rodapé do post*
```

## 📝 Formato do Frontmatter

```yaml
---
title: "Título do Post"              # Obrigatório
excerpt: "Resumo curto do post"      # Obrigatório
date: "YYYY-MM-DD"                   # Obrigatório
author:
  name: "Nome do Autor"              # Opcional (default: "Equipe FoxApply")
  avatar: "/caminho/avatar.png"      # Opcional
tags: ["Tag1", "Tag2"]               # Obrigatório (array)
coverImage: "/blog/imagem.jpg"       # Opcional
published: true                      # Opcional (default: true, false = rascunho)
---
```

## 🎨 Recursos de Markdown

### Títulos
```markdown
# H1
## H2
### H3
```

### Formatação de Texto
```markdown
**negrito**
*itálico*
~~riscado~~
`código inline`
```

### Listas
```markdown
- Item 1
- Item 2
  - Subitem

1. Primeiro
2. Segundo
```

### Links e Imagens
```markdown
[Texto do link](https://url.com)
![Alt text](/caminho/imagem.jpg)
```

### Blocos de Código
````markdown
```javascript
function exemplo() {
  console.log('Olá!');
}
```
````

### Citações
```markdown
> Esta é uma citação
> Pode ter múltiplas linhas
```

## 🔗 Rotas

- `/blog` - Lista todos os posts
- `/blog/:slug` - Post individual

## 🎯 Exemplo de Post Completo

```mdx
---
title: "10 Dicas Para Melhorar Seu LinkedIn"
excerpt: "Aprenda as melhores práticas para otimizar seu perfil e atrair recrutadores"
date: "2026-01-24"
author:
  name: "João Silva"
  avatar: "/images/joao.png"
tags: ["LinkedIn", "Carreira", "Dicas"]
coverImage: "/blog/linkedin-tips.jpg"
published: true
---

# 10 Dicas Para Melhorar Seu LinkedIn

O LinkedIn é a maior rede profissional do mundo...

## 1. Foto Profissional

Uma foto profissional aumenta em **21x** suas chances...

### Como Escolher uma Boa Foto

- Boa iluminação
- Fundo neutro
- Expressão confiante

## 2. Headline Impactante

Seu headline deve...

---

*Gostou? Compartilhe com seus colegas!*
```

## 🛠️ Desenvolvimento

### Instalar Dependências
```bash
npm install
```

### Rodar em Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

## 📦 Dependências

- `react-markdown`: Renderização de Markdown
- `gray-matter`: Parse de frontmatter
- `lucide-react`: Ícones
- `styled-components`: Estilos
- `react-router-dom`: Roteamento

## 💡 Dicas

1. **Imagens**: Coloque imagens em `public/blog/`
2. **SEO**: Preencha sempre o `excerpt` com cuidado
3. **Tags**: Use tags consistentes para melhor organização
4. **Slug**: O nome do arquivo define a URL (use kebab-case)
5. **Rascunhos**: Use `published: false` para posts em progresso

## 🎯 Próximos Passos

- [ ] Adicionar busca no blog
- [ ] Filtro por tags
- [ ] RSS Feed
- [ ] Compartilhamento social
- [ ] Comentários
- [ ] Posts relacionados
- [ ] Newsletter integration

## 📄 Licença

Parte do projeto FoxApply.

