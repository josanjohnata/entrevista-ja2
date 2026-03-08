#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function createPost() {
  console.log('\n🦊 FoxApply Blog - Criador de Posts\n');
  
  const title = await question('Título do post: ');
  const excerpt = await question('Resumo/Excerpt: ');
  const tags = await question('Tags (separadas por vírgula): ');
  const author = await question('Autor (ou Enter para "Equipe FoxApply"): ') || 'Equipe FoxApply';
  
  const today = new Date();
  const dateStr = today.toISOString().split('T')[0];
  const slug = slugify(title);
  const filename = `${dateStr}-${slug}.mdx`;
  
  const blogDir = path.join(process.cwd(), 'src', 'content', 'blog');
  
  if (!fs.existsSync(blogDir)) {
    fs.mkdirSync(blogDir, { recursive: true });
  }
  
  const filepath = path.join(blogDir, filename);
  
  if (fs.existsSync(filepath)) {
    console.log(`\n❌ Erro: Arquivo ${filename} já existe!\n`);
    rl.close();
    return;
  }
  
  const tagsList = tags.split(',').map(t => `"${t.trim()}"`).join(', ');
  
  const template = `---
title: "${title}"
excerpt: "${excerpt}"
date: "${dateStr}"
author:
  name: "${author}"
  avatar: "/images/fox-mascot.png"
tags: [${tagsList}]
coverImage: "/blog/${slug}-cover.jpg"
published: true
---

# ${title}

Introdução do seu post aqui...

## Seção 1

Conteúdo...

### Subseção

Mais conteúdo...

## Seção 2

Continue escrevendo...

## Conclusão

Finalize seu post aqui.

---

*Gostou deste conteúdo? Compartilhe com seus colegas!*
`;
  
  fs.writeFileSync(filepath, template, 'utf8');
  
  console.log(`\n✅ Post criado com sucesso!`);
  console.log(`📁 Arquivo: ${filename}`);
  console.log(`📝 Caminho: ${filepath}`);
  console.log(`\n💡 Dica: Edite o arquivo e adicione seu conteúdo em Markdown!\n`);
  
  rl.close();
}

createPost().catch(error => {
  console.error('Erro ao criar post:', error);
  rl.close();
  process.exit(1);
});

