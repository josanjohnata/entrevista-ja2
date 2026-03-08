import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Language-specific prompts for cover letter generation
const prompts: Record<string, {
  create: { system: string; user: (resume: string, job?: string) => string };
  improve: { system: string; user: (letter: string) => string };
}> = {
  pt: {
    create: {
      system: `REGRA CRÍTICA: NUNCA use textos entre colchetes como [Seu Nome], [Data], [Empresa], etc. Se não tiver uma informação, NÃO a inclua. Nenhum placeholder é permitido.

Você é um especialista em recursos humanos. Crie uma carta de apresentação profissional em português.

FORMATO OBRIGATÓRIO:
1. Comece DIRETAMENTE com "Prezado(a) Recrutador(a)," ou "Prezados(as) Senhores(as)," - SEM cabeçalho de contato
2. Escreva 3-4 parágrafos destacando qualificações relevantes
3. Termine com "Atenciosamente," seguido APENAS do nome do candidato (se disponível no currículo)

O QUE NÃO FAZER:
- NÃO inclua nome, endereço, telefone, email, data, dados da empresa no início
- NÃO use [colchetes] para nada
- NÃO invente informações que não estão no currículo`,
      user: (resume, job) => `Crie uma carta de apresentação profissional baseada nas seguintes informações:

CURRÍCULO/INFORMAÇÕES PROFISSIONAIS:
${resume}

${job ? `DESCRIÇÃO DA VAGA:
${job}` : 'Nota: Não foi fornecida descrição da vaga, então crie uma carta mais genérica que destaque as principais qualificações.'}

Por favor, gere uma carta de apresentação completa e profissional em português.`
    },
    improve: {
      system: `Você é um especialista em revisão de textos e recursos humanos. Sua tarefa é melhorar cartas de apresentação (cover letters) existentes, corrigindo erros ortográficos e gramaticais, melhorando a estrutura e tornando o texto mais profissional e impactante.

Diretrizes:
- Corrija todos os erros ortográficos e gramaticais
- Melhore a estrutura e fluxo do texto
- Torne a linguagem mais profissional quando apropriado
- Mantenha a voz e personalidade do autor
- Destaque melhorias significativas feitas
- Forneça a versão melhorada completa`,
      user: (letter) => `Por favor, revise e melhore a seguinte carta de apresentação:

${letter}

Forneça:
1. A carta de apresentação melhorada completa
2. Um breve resumo das principais correções e melhorias feitas`
    }
  },
  en: {
    create: {
      system: `CRITICAL RULE: NEVER use text in brackets like [Your Name], [Date], [Company], etc. If you don't have information, DO NOT include it. No placeholders allowed.

You are an HR expert. Create a professional cover letter in English.

REQUIRED FORMAT:
1. Start DIRECTLY with "Dear Hiring Manager," or "Dear Sir/Madam," - NO contact header
2. Write 3-4 paragraphs highlighting relevant qualifications
3. End with "Sincerely," followed ONLY by the candidate's name (if available in the resume)

WHAT NOT TO DO:
- DO NOT include name, address, phone, email, date, company info at the beginning
- DO NOT use [brackets] for anything
- DO NOT invent information not in the resume`,
      user: (resume, job) => `Create a professional cover letter based on the following information:

RESUME/PROFESSIONAL INFORMATION:
${resume}

${job ? `JOB DESCRIPTION:
${job}` : 'Note: No job description was provided, so create a more generic letter that highlights the main qualifications.'}

Please generate a complete and professional cover letter in English.`
    },
    improve: {
      system: `You are an expert in text revision and human resources. Your task is to improve existing cover letters, correcting spelling and grammatical errors, improving structure and making the text more professional and impactful.

Guidelines:
- Fix all spelling and grammatical errors
- Improve the structure and flow of the text
- Make the language more professional when appropriate
- Maintain the author's voice and personality
- Highlight significant improvements made
- Provide the complete improved version`,
      user: (letter) => `Please review and improve the following cover letter:

${letter}

Provide:
1. The complete improved cover letter
2. A brief summary of the main corrections and improvements made`
    }
  },
  es: {
    create: {
      system: `REGLA CRÍTICA: NUNCA uses texto entre corchetes como [Tu Nombre], [Fecha], [Empresa], etc. Si no tienes una información, NO la incluyas. Ningún placeholder permitido.

Eres un experto en RRHH. Crea una carta de presentación profesional en español.

FORMATO OBLIGATORIO:
1. Comienza DIRECTAMENTE con "Estimado/a Reclutador/a," o "Estimados Señores," - SIN encabezado de contacto
2. Escribe 3-4 párrafos destacando cualificaciones relevantes
3. Termina con "Atentamente," seguido SOLO del nombre del candidato (si está disponible en el currículum)

LO QUE NO HACER:
- NO incluyas nombre, dirección, teléfono, email, fecha, datos de empresa al inicio
- NO uses [corchetes] para nada
- NO inventes información que no esté en el currículum`,
      user: (resume, job) => `Crea una carta de presentación profesional basada en la siguiente información:

CURRÍCULUM/INFORMACIÓN PROFESIONAL:
${resume}

${job ? `DESCRIPCIÓN DEL PUESTO:
${job}` : 'Nota: No se proporcionó descripción del puesto, así que crea una carta más genérica que destaque las principales cualificaciones.'}

Por favor, genera una carta de presentación completa y profesional en español.`
    },
    improve: {
      system: `Eres un experto en revisión de textos y recursos humanos. Tu tarea es mejorar cartas de presentación existentes, corrigiendo errores ortográficos y gramaticales, mejorando la estructura y haciendo el texto más profesional e impactante.

Directrices:
- Corrige todos los errores ortográficos y gramaticales
- Mejora la estructura y fluidez del texto
- Haz el lenguaje más profesional cuando sea apropiado
- Mantén la voz y personalidad del autor
- Destaca las mejoras significativas realizadas
- Proporciona la versión mejorada completa`,
      user: (letter) => `Por favor, revisa y mejora la siguiente carta de presentación:

${letter}

Proporciona:
1. La carta de presentación mejorada completa
2. Un breve resumen de las principales correcciones y mejoras realizadas`
    }
  },
  fr: {
    create: {
      system: `RÈGLE CRITIQUE: N'utilisez JAMAIS de texte entre crochets comme [Votre Nom], [Date], [Entreprise], etc. Si vous n'avez pas une information, NE l'incluez PAS. Aucun placeholder permis.

Vous êtes expert RH. Créez une lettre de motivation professionnelle en français.

FORMAT OBLIGATOIRE:
1. Commencez DIRECTEMENT par "Madame, Monsieur," - SANS en-tête de coordonnées
2. Écrivez 3-4 paragraphes mettant en valeur les qualifications pertinentes
3. Terminez par "Cordialement," suivi UNIQUEMENT du nom du candidat (si disponible dans le CV)

CE QU'IL NE FAUT PAS FAIRE:
- N'incluez PAS nom, adresse, téléphone, email, date, infos entreprise au début
- N'utilisez PAS de [crochets] pour quoi que ce soit
- N'inventez PAS d'informations absentes du CV`,
      user: (resume, job) => `Créez une lettre de motivation professionnelle basée sur les informations suivantes:

CV/INFORMATIONS PROFESSIONNELLES:
${resume}

${job ? `DESCRIPTION DU POSTE:
${job}` : 'Note: Aucune description de poste n\'a été fournie, créez donc une lettre plus générique mettant en avant les principales qualifications.'}

Veuillez générer une lettre de motivation complète et professionnelle en français.`
    },
    improve: {
      system: `Vous êtes un expert en révision de textes et en ressources humaines. Votre tâche est d'améliorer les lettres de motivation existantes, en corrigeant les erreurs d'orthographe et de grammaire, en améliorant la structure et en rendant le texte plus professionnel et percutant.

Directives:
- Corrigez toutes les erreurs d'orthographe et de grammaire
- Améliorez la structure et le flux du texte
- Rendez le langage plus professionnel si nécessaire
- Maintenez la voix et la personnalité de l'auteur
- Soulignez les améliorations significatives apportées
- Fournissez la version améliorée complète`,
      user: (letter) => `Veuillez réviser et améliorer la lettre de motivation suivante:

${letter}

Fournissez:
1. La lettre de motivation améliorée complète
2. Un bref résumé des principales corrections et améliorations apportées`
    }
  },
  ru: {
    create: {
      system: `КРИТИЧЕСКОЕ ПРАВИЛО: НИКОГДА не используйте текст в скобках типа [Ваше Имя], [Дата], [Компания] и т.д. Если нет информации, НЕ включайте её. Никаких заполнителей.

Вы эксперт HR. Создайте профессиональное сопроводительное письмо на русском.

ОБЯЗАТЕЛЬНЫЙ ФОРМАТ:
1. Начните СРАЗУ с "Уважаемый рекрутер," или "Уважаемые господа," - БЕЗ шапки с контактами
2. Напишите 3-4 абзаца, выделяя релевантные квалификации
3. Закончите "С уважением," с ТОЛЬКО именем кандидата (если есть в резюме)

ЧЕГО НЕ ДЕЛАТЬ:
- НЕ включайте имя, адрес, телефон, email, дату, данные компании в начале
- НЕ используйте [скобки] ни для чего
- НЕ придумывайте информацию, которой нет в резюме`,
      user: (resume, job) => `Создайте профессиональное сопроводительное письмо на основе следующей информации:

РЕЗЮМЕ/ПРОФЕССИОНАЛЬНАЯ ИНФОРМАЦИЯ:
${resume}

${job ? `ОПИСАНИЕ ВАКАНСИИ:
${job}` : 'Примечание: Описание вакансии не предоставлено, поэтому создайте более общее письмо, подчеркивающее основные квалификации.'}

Пожалуйста, сгенерируйте полное профессиональное сопроводительное письмо на русском языке.`
    },
    improve: {
      system: `Вы эксперт в области редактирования текстов и управления персоналом. Ваша задача — улучшать существующие сопроводительные письма, исправляя орфографические и грамматические ошибки, улучшая структуру и делая текст более профессиональным и убедительным.

Рекомендации:
- Исправьте все орфографические и грамматические ошибки
- Улучшите структуру и поток текста
- Сделайте язык более профессиональным, где это уместно
- Сохраните голос и индивидуальность автора
- Выделите значительные улучшения
- Предоставьте полную улучшенную версию`,
      user: (letter) => `Пожалуйста, проверьте и улучшите следующее сопроводительное письмо:

${letter}

Предоставьте:
1. Полное улучшенное сопроводительное письмо
2. Краткое резюме основных исправлений и улучшений`
    }
  },
  ar: {
    create: {
      system: `قاعدة حرجة: لا تستخدم أبداً نصاً بين أقواس مثل [اسمك]، [التاريخ]، [الشركة]، إلخ. إذا لم تكن لديك معلومة، لا تضمنها. لا يُسمح بأي علامات.

أنت خبير موارد بشرية. أنشئ خطاب تغطية احترافي بالعربية.

الشكل المطلوب:
1. ابدأ مباشرة بـ "السيد/ة المحترم/ة،" - بدون رأس معلومات الاتصال
2. اكتب 3-4 فقرات تبرز المؤهلات ذات الصلة
3. اختم بـ "مع التحية،" متبوعاً فقط باسم المرشح (إذا كان متاحاً في السيرة الذاتية)

ما لا يجب فعله:
- لا تضمن الاسم، العنوان، الهاتف، البريد، التاريخ، بيانات الشركة في البداية
- لا تستخدم [الأقواس] لأي شيء
- لا تخترع معلومات غير موجودة في السيرة الذاتية`,
      user: (resume, job) => `أنشئ خطاب تغطية احترافي بناءً على المعلومات التالية:

السيرة الذاتية/المعلومات المهنية:
${resume}

${job ? `وصف الوظيفة:
${job}` : 'ملاحظة: لم يتم توفير وصف الوظيفة، لذا قم بإنشاء خطاب أكثر عمومية يبرز المؤهلات الرئيسية.'}

يرجى إنشاء خطاب تغطية كامل واحترافي باللغة العربية.`
    },
    improve: {
      system: `أنت خبير في مراجعة النصوص والموارد البشرية. مهمتك هي تحسين خطابات التغطية الموجودة، وتصحيح الأخطاء الإملائية والنحوية، وتحسين الهيكل وجعل النص أكثر احترافية وتأثيراً.

إرشادات:
- صحح جميع الأخطاء الإملائية والنحوية
- حسّن هيكل وانسيابية النص
- اجعل اللغة أكثر احترافية عند الاقتضاء
- حافظ على صوت وشخصية الكاتب
- أبرز التحسينات الهامة التي تم إجراؤها
- قدم النسخة المحسنة الكاملة`,
      user: (letter) => `يرجى مراجعة وتحسين خطاب التغطية التالي:

${letter}

قدم:
1. خطاب التغطية المحسن الكامل
2. ملخص موجز للتصحيحات والتحسينات الرئيسية التي تم إجراؤها`
    }
  },
  zh: {
    create: {
      system: `关键规则：永远不要使用方括号内的文字如[您的姓名]、[日期]、[公司]等。如果没有信息，不要包含。不允许任何占位符。

您是HR专家。用中文创建专业求职信。

必须格式：
1. 直接以"尊敬的招聘经理，"开头 - 不要联系信息抬头
2. 写3-4段突出相关资质
3. 以"此致敬礼，"结尾，仅附候选人姓名（如简历中有）

不要做的事：
- 不要在开头包含姓名、地址、电话、邮箱、日期、公司信息
- 不要使用[方括号]
- 不要编造简历中没有的信息`,
      user: (resume, job) => `根据以下信息创建一封专业的求职信：

简历/专业信息：
${resume}

${job ? `职位描述：
${job}` : '注意：未提供职位描述，因此请创建一封更通用的信函，突出主要资质。'}

请用中文生成一封完整且专业的求职信。`
    },
    improve: {
      system: `您是文本修订和人力资源方面的专家。您的任务是改进现有的求职信，纠正拼写和语法错误，改善结构，使文本更专业、更有影响力。

指南：
- 修正所有拼写和语法错误
- 改善文本的结构和流畅性
- 在适当时使语言更专业
- 保持作者的声音和个性
- 突出所做的重要改进
- 提供完整的改进版本`,
      user: (letter) => `请审阅并改进以下求职信：

${letter}

请提供：
1. 完整的改进后求职信
2. 主要更正和改进的简要总结`
    }
  },
  hi: {
    create: {
      system: `महत्वपूर्ण नियम: कभी भी कोष्ठक में पाठ न लिखें जैसे [आपका नाम], [तारीख], [कंपनी], आदि। यदि जानकारी नहीं है, तो शामिल न करें। कोई प्लेसहोल्डर नहीं।

आप HR विशेषज्ञ हैं। हिंदी में पेशेवर कवर लेटर बनाएं।

अनिवार्य प्रारूप:
1. सीधे "प्रिय भर्ती प्रबंधक," से शुरू करें - संपर्क शीर्षक नहीं
2. 3-4 पैराग्राफ लिखें जो प्रासंगिक योग्यताओं को उजागर करें
3. "सादर," के साथ समाप्त करें, केवल उम्मीदवार का नाम (यदि रिज्यूमे में उपलब्ध)

क्या नहीं करना:
- शुरू में नाम, पता, फोन, ईमेल, तारीख, कंपनी जानकारी शामिल न करें
- [कोष्ठक] का उपयोग न करें
- रिज्यूमे में नहीं है वह जानकारी न बनाएं`,
      user: (resume, job) => `निम्नलिखित जानकारी के आधार पर एक पेशेवर कवर लेटर बनाएं:

रिज्यूमे/पेशेवर जानकारी:
${resume}

${job ? `नौकरी विवरण:
${job}` : 'नोट: कोई नौकरी विवरण प्रदान नहीं किया गया था, इसलिए एक अधिक सामान्य पत्र बनाएं जो मुख्य योग्यताओं को उजागर करता है।'}

कृपया हिंदी में एक पूर्ण और पेशेवर कवर लेटर जनरेट करें।`
    },
    improve: {
      system: `आप टेक्स्ट संशोधन और मानव संसाधन में विशेषज्ञ हैं। आपका कार्य मौजूदा कवर लेटर्स को बेहतर बनाना है, वर्तनी और व्याकरण की त्रुटियों को ठीक करना, संरचना में सुधार करना और पाठ को अधिक पेशेवर और प्रभावशाली बनाना है।

दिशानिर्देश:
- सभी वर्तनी और व्याकरण की त्रुटियों को ठीक करें
- पाठ की संरचना और प्रवाह में सुधार करें
- जहां उपयुक्त हो भाषा को अधिक पेशेवर बनाएं
- लेखक की आवाज और व्यक्तित्व बनाए रखें
- किए गए महत्वपूर्ण सुधारों को उजागर करें
- पूर्ण सुधारित संस्करण प्रदान करें`,
      user: (letter) => `कृपया निम्नलिखित कवर लेटर की समीक्षा करें और उसे बेहतर बनाएं:

${letter}

प्रदान करें:
1. पूर्ण सुधारित कवर लेटर
2. मुख्य सुधारों और बेहतरियों का संक्षिप्त सारांश`
    }
  },
  bn: {
    create: {
      system: `গুরুত্বপূর্ণ নিয়ম: কখনই বন্ধনীতে লেখা ব্যবহার করবেন না যেমন [আপনার নাম], [তারিখ], [কোম্পানি], ইত্যাদি। তথ্য না থাকলে অন্তর্ভুক্ত করবেন না। কোনো প্লেসহোল্ডার নয়।

আপনি HR বিশেষজ্ঞ। বাংলায় পেশাদার কভার লেটার তৈরি করুন।

বাধ্যতামূলক ফরম্যাট:
1. সরাসরি "প্রিয় নিয়োগ ব্যবস্থাপক," দিয়ে শুরু করুন - যোগাযোগ শিরোনাম নয়
2. 3-4 অনুচ্ছেদ লিখুন প্রাসঙ্গিক যোগ্যতা তুলে ধরে
3. "শ্রদ্ধাপূর্বক," দিয়ে শেষ করুন, শুধু প্রার্থীর নাম (রিজিউমে থাকলে)

কী করবেন না:
- শুরুতে নাম, ঠিকানা, ফোন, ইমেল, তারিখ, কোম্পানি তথ্য অন্তর্ভুক্ত করবেন না
- [বন্ধনী] ব্যবহার করবেন না
- রিজিউমে নেই এমন তথ্য তৈরি করবেন না`,
      user: (resume, job) => `নিম্নলিখিত তথ্যের উপর ভিত্তি করে একটি পেশাদার কভার লেটার তৈরি করুন:

জীবনবৃত্তান্ত/পেশাদার তথ্য:
${resume}

${job ? `চাকরির বিবরণ:
${job}` : 'দ্রষ্টব্য: কোন চাকরির বিবরণ প্রদান করা হয়নি, তাই মূল যোগ্যতাগুলি তুলে ধরে একটি আরও সাধারণ চিঠি তৈরি করুন।'}

অনুগ্রহ করে বাংলায় একটি সম্পূর্ণ এবং পেশাদার কভার লেটার তৈরি করুন।`
    },
    improve: {
      system: `আপনি টেক্সট সংশোধন এবং মানব সম্পদে বিশেষজ্ঞ। আপনার কাজ হল বিদ্যমান কভার লেটারগুলি উন্নত করা, বানান এবং ব্যাকরণগত ত্রুটি সংশোধন করা, কাঠামো উন্নত করা এবং পাঠ্যকে আরও পেশাদার এবং প্রভাবশালী করা।

নির্দেশিকা:
- সমস্ত বানান এবং ব্যাকরণগত ত্রুটি সংশোধন করুন
- পাঠ্যের কাঠামো এবং প্রবাহ উন্নত করুন
- যেখানে উপযুক্ত সেখানে ভাষা আরও পেশাদার করুন
- লেখকের কণ্ঠস্বর এবং ব্যক্তিত্ব বজায় রাখুন
- করা উল্লেখযোগ্য উন্নতিগুলি তুলে ধরুন
- সম্পূর্ণ উন্নত সংস্করণ প্রদান করুন`,
      user: (letter) => `অনুগ্রহ করে নিম্নলিখিত কভার লেটারটি পর্যালোচনা এবং উন্নত করুন:

${letter}

প্রদান করুন:
1. সম্পূর্ণ উন্নত কভার লেটার
2. করা প্রধান সংশোধন এবং উন্নতির সংক্ষিপ্ত সারাংশ`
    }
  },
  id: {
    create: {
      system: `ATURAN KRITIS: JANGAN PERNAH gunakan teks dalam kurung seperti [Nama Anda], [Tanggal], [Perusahaan], dll. Jika tidak ada informasi, JANGAN sertakan. Tidak ada placeholder yang diizinkan.

Anda ahli HR. Buat surat lamaran profesional dalam Bahasa Indonesia.

FORMAT WAJIB:
1. Mulai LANGSUNG dengan "Yth. Bapak/Ibu HRD," - TANPA header kontak
2. Tulis 3-4 paragraf yang menonjolkan kualifikasi relevan
3. Akhiri dengan "Hormat saya," diikuti HANYA nama kandidat (jika tersedia di CV)

YANG TIDAK BOLEH DILAKUKAN:
- JANGAN sertakan nama, alamat, telepon, email, tanggal, info perusahaan di awal
- JANGAN gunakan [kurung] untuk apapun
- JANGAN mengarang informasi yang tidak ada di CV`,
      user: (resume, job) => `Buat surat lamaran profesional berdasarkan informasi berikut:

CV/INFORMASI PROFESIONAL:
${resume}

${job ? `DESKRIPSI PEKERJAAN:
${job}` : 'Catatan: Tidak ada deskripsi pekerjaan yang diberikan, jadi buat surat yang lebih umum yang menonjolkan kualifikasi utama.'}

Silakan buat surat lamaran yang lengkap dan profesional dalam Bahasa Indonesia.`
    },
    improve: {
      system: `Anda adalah ahli dalam revisi teks dan sumber daya manusia. Tugas Anda adalah memperbaiki surat lamaran yang ada, memperbaiki kesalahan ejaan dan tata bahasa, meningkatkan struktur dan membuat teks lebih profesional dan berdampak.

Panduan:
- Perbaiki semua kesalahan ejaan dan tata bahasa
- Tingkatkan struktur dan aliran teks
- Buat bahasa lebih profesional jika sesuai
- Pertahankan suara dan kepribadian penulis
- Soroti perbaikan signifikan yang dilakukan
- Berikan versi yang ditingkatkan secara lengkap`,
      user: (letter) => `Silakan tinjau dan tingkatkan surat lamaran berikut:

${letter}

Berikan:
1. Surat lamaran yang ditingkatkan secara lengkap
2. Ringkasan singkat koreksi dan perbaikan utama yang dilakukan`
    }
  }
};

// Error messages by language
const errorMessages: Record<string, { rateLimited: string; insufficientCredits: string; processingError: string }> = {
  pt: {
    rateLimited: 'Limite de requisições excedido. Por favor, tente novamente mais tarde.',
    insufficientCredits: 'Créditos insuficientes. Por favor, adicione créditos à sua conta.',
    processingError: 'Erro ao processar sua solicitação'
  },
  en: {
    rateLimited: 'Request limit exceeded. Please try again later.',
    insufficientCredits: 'Insufficient credits. Please add credits to your account.',
    processingError: 'Error processing your request'
  },
  es: {
    rateLimited: 'Límite de solicitudes excedido. Por favor, inténtelo de nuevo más tarde.',
    insufficientCredits: 'Créditos insuficientes. Por favor, agregue créditos a su cuenta.',
    processingError: 'Error al procesar su solicitud'
  },
  fr: {
    rateLimited: 'Limite de requêtes dépassée. Veuillez réessayer plus tard.',
    insufficientCredits: 'Crédits insuffisants. Veuillez ajouter des crédits à votre compte.',
    processingError: 'Erreur lors du traitement de votre demande'
  },
  ru: {
    rateLimited: 'Превышен лимит запросов. Пожалуйста, попробуйте позже.',
    insufficientCredits: 'Недостаточно кредитов. Пожалуйста, пополните баланс.',
    processingError: 'Ошибка при обработке вашего запроса'
  },
  ar: {
    rateLimited: 'تم تجاوز حد الطلبات. يرجى المحاولة لاحقاً.',
    insufficientCredits: 'رصيد غير كافٍ. يرجى إضافة رصيد إلى حسابك.',
    processingError: 'خطأ في معالجة طلبك'
  },
  zh: {
    rateLimited: '请求次数超限。请稍后再试。',
    insufficientCredits: '积分不足。请为您的账户充值。',
    processingError: '处理您的请求时出错'
  },
  hi: {
    rateLimited: 'अनुरोध सीमा पार हो गई। कृपया बाद में पुनः प्रयास करें।',
    insufficientCredits: 'अपर्याप्त क्रेडिट। कृपया अपने खाते में क्रेडिट जोड़ें।',
    processingError: 'आपके अनुरोध को संसाधित करने में त्रुटि'
  },
  bn: {
    rateLimited: 'অনুরোধ সীমা অতিক্রম করেছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।',
    insufficientCredits: 'অপর্যাপ্ত ক্রেডিট। অনুগ্রহ করে আপনার অ্যাকাউন্টে ক্রেডিট যোগ করুন।',
    processingError: 'আপনার অনুরোধ প্রসেস করতে সমস্যা'
  },
  id: {
    rateLimited: 'Batas permintaan terlampaui. Silakan coba lagi nanti.',
    insufficientCredits: 'Kredit tidak cukup. Silakan tambahkan kredit ke akun Anda.',
    processingError: 'Kesalahan saat memproses permintaan Anda'
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, resumeInput, jobDescription, existingLetter, language = 'pt' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('AI service not configured');
    }

    console.log(`Processing ${type} request in ${language}`);

    // Get language-specific prompts (fallback to English if not found)
    const langPrompts = prompts[language] || prompts.en;
    const messages = errorMessages[language] || errorMessages.en;
    
    let systemPrompt = '';
    let userPrompt = '';

    if (type === 'create') {
      systemPrompt = langPrompts.create.system;
      userPrompt = langPrompts.create.user(resumeInput, jobDescription);
    } else {
      systemPrompt = langPrompts.improve.system;
      userPrompt = langPrompts.improve.user(existingLetter);
    }

    console.log('Calling Lovable AI Gateway...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: messages.rateLimited }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: messages.insufficientCredits }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      
      throw new Error('AI service error');
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content || '';
    
    console.log('AI response received successfully');

    return new Response(JSON.stringify({ result: generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-cover-letter function:', error);
    
    // Try to get language for error message
    let errorMessage = 'Erro ao processar sua solicitação';
    try {
      const messages = errorMessages['pt'];
      errorMessage = messages.processingError;
    } catch {}
    
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : errorMessage 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
