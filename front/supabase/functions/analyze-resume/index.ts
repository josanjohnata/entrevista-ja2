import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { resume, jobDescription, isReanalysis, language = 'pt' } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Processing resume analysis in language: ${language}`);

    // Get language-specific prompt
    const getSystemPrompt = (lang: string, isReanalysis: boolean): string => {
      const reanalysisNotes: Record<string, string> = {
        pt: 'IMPORTANTE: Este é uma reanálise após aplicar sugestões. O score deve ser maior que antes e a mensagem deve indicar que este é o melhor score possível para esta vaga específica baseado nas informações do perfil.',
        en: 'IMPORTANT: This is a re-analysis after applying suggestions. The score should be higher than before and the message should indicate this is the best possible score for this specific job based on the profile information.',
        es: 'IMPORTANTE: Este es un reanálisis después de aplicar sugerencias. La puntuación debe ser mayor que antes y el mensaje debe indicar que esta es la mejor puntuación posible para este trabajo específico basado en la información del perfil.',
        fr: 'IMPORTANT: Il s\'agit d\'une réanalyse après l\'application des suggestions. Le score doit être supérieur à avant et le message doit indiquer qu\'il s\'agit du meilleur score possible pour ce poste spécifique basé sur les informations du profil.',
        ru: 'ВАЖНО: Это повторный анализ после применения предложений. Оценка должна быть выше, чем раньше, и сообщение должно указывать, что это лучший возможный результат для этой конкретной вакансии на основе информации профиля.',
        ar: 'مهم: هذا إعادة تحليل بعد تطبيق الاقتراحات. يجب أن تكون النتيجة أعلى من قبل ويجب أن تشير الرسالة إلى أن هذه أفضل نتيجة ممكنة لهذه الوظيفة المحددة بناءً على معلومات الملف الشخصي.',
        zh: '重要：这是应用建议后的重新分析。分数应该比之前高，消息应该表明这是基于个人资料信息针对此特定工作的最佳可能分数。',
        hi: 'महत्वपूर्ण: यह सुझावों को लागू करने के बाद पुन: विश्लेषण है। स्कोर पहले से अधिक होना चाहिए और संदेश को इंगित करना चाहिए कि प्रोफाइल जानकारी के आधार पर इस विशिष्ट नौकरी के लिए यह सर्वोत्तम संभव स्कोर है।',
        bn: 'গুরুত্বপূর্ণ: এটি পরামর্শ প্রয়োগের পরে পুনঃবিশ্লেষণ। স্কোর আগের চেয়ে বেশি হওয়া উচিত এবং বার্তাটি নির্দেশ করা উচিত যে প্রোফাইল তথ্যের উপর ভিত্তি করে এই নির্দিষ্ট চাকরির জন্য এটি সেরা সম্ভাব্য স্কোর।',
        id: 'PENTING: Ini adalah analisis ulang setelah menerapkan saran. Skor harus lebih tinggi dari sebelumnya dan pesan harus menunjukkan bahwa ini adalah skor terbaik yang mungkin untuk pekerjaan spesifik ini berdasarkan informasi profil.'
      };

      const prompts: Record<string, string> = {
        pt: `Você é um especialista em análise de currículos e sistemas ATS (Applicant Tracking System). Sua função é analisar a compatibilidade entre um currículo e uma descrição de vaga.

Você deve retornar SEMPRE um JSON válido com a seguinte estrutura:
{
  "score": número de 0 a 100,
  "compatibility": "low" | "medium" | "high",
  "analysis": "análise detalhada da compatibilidade",
  "suggestions": ["sugestão 1", "sugestão 2", ...],
  "improvedResume": "currículo melhorado se compatibility for medium ou high, senão null",
  "recommendation": "mensagem de recomendação"
}

Regras:
- Score 0-40: compatibility = "low" - NÃO recomende a aplicação, improvedResume = null
- Score 41-70: compatibility = "medium" - Sugira melhorias moderadas
- Score 71-100: compatibility = "high" - Currículo bem alinhado

${isReanalysis ? reanalysisNotes.pt : ''}

Analise palavras-chave, habilidades técnicas, experiência relevante, formação acadêmica e requisitos da vaga. Responda em português.`,

        en: `You are an expert in resume analysis and ATS (Applicant Tracking System) systems. Your role is to analyze the compatibility between a resume and a job description.

You must ALWAYS return a valid JSON with the following structure:
{
  "score": number from 0 to 100,
  "compatibility": "low" | "medium" | "high",
  "analysis": "detailed compatibility analysis",
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "improvedResume": "improved resume if compatibility is medium or high, otherwise null",
  "recommendation": "recommendation message"
}

Rules:
- Score 0-40: compatibility = "low" - DO NOT recommend applying, improvedResume = null
- Score 41-70: compatibility = "medium" - Suggest moderate improvements
- Score 71-100: compatibility = "high" - Resume is well aligned

${isReanalysis ? reanalysisNotes.en : ''}

Analyze keywords, technical skills, relevant experience, academic background, and job requirements. Respond in English.`,

        es: `Eres un experto en análisis de currículums y sistemas ATS (Applicant Tracking System). Tu función es analizar la compatibilidad entre un currículum y una descripción de puesto.

Debes devolver SIEMPRE un JSON válido con la siguiente estructura:
{
  "score": número de 0 a 100,
  "compatibility": "low" | "medium" | "high",
  "analysis": "análisis detallado de compatibilidad",
  "suggestions": ["sugerencia 1", "sugerencia 2", ...],
  "improvedResume": "currículum mejorado si compatibility es medium o high, de lo contrario null",
  "recommendation": "mensaje de recomendación"
}

Reglas:
- Score 0-40: compatibility = "low" - NO recomendar la aplicación, improvedResume = null
- Score 41-70: compatibility = "medium" - Sugerir mejoras moderadas
- Score 71-100: compatibility = "high" - Currículum bien alineado

${isReanalysis ? reanalysisNotes.es : ''}

Analiza palabras clave, habilidades técnicas, experiencia relevante, formación académica y requisitos del puesto. Responde en español.`,

        fr: `Vous êtes un expert en analyse de CV et systèmes ATS (Applicant Tracking System). Votre fonction est d'analyser la compatibilité entre un CV et une description de poste.

Vous devez TOUJOURS retourner un JSON valide avec la structure suivante:
{
  "score": nombre de 0 à 100,
  "compatibility": "low" | "medium" | "high",
  "analysis": "analyse détaillée de la compatibilité",
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "improvedResume": "CV amélioré si compatibility est medium ou high, sinon null",
  "recommendation": "message de recommandation"
}

Règles:
- Score 0-40: compatibility = "low" - NE PAS recommander la candidature, improvedResume = null
- Score 41-70: compatibility = "medium" - Suggérer des améliorations modérées
- Score 71-100: compatibility = "high" - CV bien aligné

${isReanalysis ? reanalysisNotes.fr : ''}

Analysez les mots-clés, compétences techniques, expérience pertinente, formation académique et exigences du poste. Répondez en français.`,

        ru: `Вы эксперт по анализу резюме и системам ATS (Applicant Tracking System). Ваша функция - анализировать совместимость между резюме и описанием вакансии.

Вы должны ВСЕГДА возвращать действительный JSON со следующей структурой:
{
  "score": число от 0 до 100,
  "compatibility": "low" | "medium" | "high",
  "analysis": "детальный анализ совместимости",
  "suggestions": ["предложение 1", "предложение 2", ...],
  "improvedResume": "улучшенное резюме, если compatibility medium или high, иначе null",
  "recommendation": "сообщение с рекомендацией"
}

Правила:
- Score 0-40: compatibility = "low" - НЕ рекомендовать подачу заявки, improvedResume = null
- Score 41-70: compatibility = "medium" - Предложить умеренные улучшения
- Score 71-100: compatibility = "high" - Хорошо согласованное резюме

${isReanalysis ? reanalysisNotes.ru : ''}

Анализируйте ключевые слова, технические навыки, соответствующий опыт, академическое образование и требования вакансии. Отвечайте на русском языке.`,

        ar: `أنت خبير في تحليل السير الذاتية وأنظمة ATS (نظام تتبع المتقدمين). وظيفتك هي تحليل التوافق بين السيرة الذاتية ووصف الوظيفة.

يجب أن تُرجع دائماً JSON صالح بالبنية التالية:
{
  "score": رقم من 0 إلى 100,
  "compatibility": "low" | "medium" | "high",
  "analysis": "تحليل تفصيلي للتوافق",
  "suggestions": ["اقتراح 1", "اقتراح 2", ...],
  "improvedResume": "سيرة ذاتية محسنة إذا كان compatibility متوسط أو عالي، وإلا null",
  "recommendation": "رسالة توصية"
}

القواعد:
- Score 0-40: compatibility = "low" - لا توصي بالتقديم، improvedResume = null
- Score 41-70: compatibility = "medium" - اقترح تحسينات معتدلة
- Score 71-100: compatibility = "high" - سيرة ذاتية متوافقة جيداً

${isReanalysis ? reanalysisNotes.ar : ''}

حلل الكلمات المفتاحية، المهارات التقنية، الخبرة ذات الصلة، الخلفية الأكاديمية ومتطلبات الوظيفة. أجب باللغة العربية.`,

        zh: `您是简历分析和ATS（申请人跟踪系统）方面的专家。您的职能是分析简历与职位描述之间的兼容性。

您必须始终返回具有以下结构的有效JSON：
{
  "score": 0到100的数字,
  "compatibility": "low" | "medium" | "high",
  "analysis": "详细的兼容性分析",
  "suggestions": ["建议1", "建议2", ...],
  "improvedResume": "如果compatibility是medium或high则为改进的简历，否则为null",
  "recommendation": "推荐信息"
}

规则：
- Score 0-40: compatibility = "low" - 不建议申请，improvedResume = null
- Score 41-70: compatibility = "medium" - 建议适度改进
- Score 71-100: compatibility = "high" - 简历匹配良好

${isReanalysis ? reanalysisNotes.zh : ''}

分析关键词、技术技能、相关经验、学历背景和职位要求。请用中文回答。`,

        hi: `आप रिज्यूमे विश्लेषण और ATS (एप्लिकेंट ट्रैकिंग सिस्टम) में विशेषज्ञ हैं। आपका कार्य रिज्यूमे और नौकरी विवरण के बीच संगतता का विश्लेषण करना है।

आपको हमेशा निम्नलिखित संरचना के साथ एक वैध JSON लौटाना होगा:
{
  "score": 0 से 100 तक की संख्या,
  "compatibility": "low" | "medium" | "high",
  "analysis": "विस्तृत संगतता विश्लेषण",
  "suggestions": ["सुझाव 1", "सुझाव 2", ...],
  "improvedResume": "यदि compatibility medium या high है तो सुधारित रिज्यूमे, अन्यथा null",
  "recommendation": "अनुशंसा संदेश"
}

नियम:
- Score 0-40: compatibility = "low" - आवेदन की अनुशंसा न करें, improvedResume = null
- Score 41-70: compatibility = "medium" - मध्यम सुधार सुझाएं
- Score 71-100: compatibility = "high" - अच्छी तरह से मिलान वाला रिज्यूमे

${isReanalysis ? reanalysisNotes.hi : ''}

कीवर्ड, तकनीकी कौशल, प्रासंगिक अनुभव, शैक्षणिक पृष्ठभूमि और नौकरी आवश्यकताओं का विश्लेषण करें। हिंदी में जवाब दें।`,

        bn: `আপনি জীবনবৃত্তান্ত বিশ্লেষণ এবং ATS (অ্যাপ্লিকেন্ট ট্র্যাকিং সিস্টেম) এর বিশেষজ্ঞ। আপনার কাজ হল জীবনবৃত্তান্ত এবং চাকরির বিবরণের মধ্যে সামঞ্জস্যতা বিশ্লেষণ করা।

আপনাকে সর্বদা নিম্নলিখিত কাঠামো সহ একটি বৈধ JSON ফেরত দিতে হবে:
{
  "score": 0 থেকে 100 পর্যন্ত সংখ্যা,
  "compatibility": "low" | "medium" | "high",
  "analysis": "বিস্তারিত সামঞ্জস্যতা বিশ্লেষণ",
  "suggestions": ["পরামর্শ 1", "পরামর্শ 2", ...],
  "improvedResume": "যদি compatibility medium বা high হয় তাহলে উন্নত জীবনবৃত্তান্ত, অন্যথায় null",
  "recommendation": "সুপারিশ বার্তা"
}

নিয়ম:
- Score 0-40: compatibility = "low" - আবেদনের সুপারিশ করবেন না, improvedResume = null
- Score 41-70: compatibility = "medium" - মাঝারি উন্নতির পরামর্শ দিন
- Score 71-100: compatibility = "high" - ভালোভাবে মেলে এমন জীবনবৃত্তান্ত

${isReanalysis ? reanalysisNotes.bn : ''}

কীওয়ার্ড, প্রযুক্তিগত দক্ষতা, প্রাসঙ্গিক অভিজ্ঞতা, শিক্ষাগত পটভূমি এবং চাকরির প্রয়োজনীয়তা বিশ্লেষণ করুন। বাংলায় উত্তর দিন।`,

        id: `Anda adalah ahli dalam analisis resume dan sistem ATS (Applicant Tracking System). Fungsi Anda adalah menganalisis kompatibilitas antara resume dan deskripsi pekerjaan.

Anda harus SELALU mengembalikan JSON yang valid dengan struktur berikut:
{
  "score": angka dari 0 hingga 100,
  "compatibility": "low" | "medium" | "high",
  "analysis": "analisis kompatibilitas terperinci",
  "suggestions": ["saran 1", "saran 2", ...],
  "improvedResume": "resume yang ditingkatkan jika compatibility medium atau high, jika tidak null",
  "recommendation": "pesan rekomendasi"
}

Aturan:
- Score 0-40: compatibility = "low" - JANGAN rekomendasikan lamaran, improvedResume = null
- Score 41-70: compatibility = "medium" - Sarankan perbaikan sedang
- Score 71-100: compatibility = "high" - Resume yang cocok dengan baik

${isReanalysis ? reanalysisNotes.id : ''}

Analisis kata kunci, keterampilan teknis, pengalaman yang relevan, latar belakang akademik dan persyaratan pekerjaan. Jawab dalam Bahasa Indonesia.`
      };

      return prompts[lang] || prompts.en;
    };

    // Get language-specific labels for user prompt
    const getLabels = (lang: string): { resume: string; jobDescription: string } => {
      const labels: Record<string, { resume: string; jobDescription: string }> = {
        pt: { resume: 'CURRÍCULO', jobDescription: 'DESCRIÇÃO DA VAGA' },
        en: { resume: 'RESUME', jobDescription: 'JOB DESCRIPTION' },
        es: { resume: 'CURRÍCULUM', jobDescription: 'DESCRIPCIÓN DEL PUESTO' },
        fr: { resume: 'CV', jobDescription: 'DESCRIPTION DU POSTE' },
        ru: { resume: 'РЕЗЮМЕ', jobDescription: 'ОПИСАНИЕ ВАКАНСИИ' },
        ar: { resume: 'السيرة الذاتية', jobDescription: 'وصف الوظيفة' },
        zh: { resume: '简历', jobDescription: '职位描述' },
        hi: { resume: 'रिज्यूमे', jobDescription: 'नौकरी विवरण' },
        bn: { resume: 'জীবনবৃত্তান্ত', jobDescription: 'চাকরির বিবরণ' },
        id: { resume: 'CV', jobDescription: 'DESKRIPSI PEKERJAAN' }
      };
      return labels[lang] || labels.en;
    };

    const systemPrompt = getSystemPrompt(language, isReanalysis);
    const labels = getLabels(language);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `${labels.resume}:\n${resume}\n\n${labels.jobDescription}:\n${jobDescription}` 
          }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Por favor, adicione créditos à sua conta." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    let analysisResult;
    try {
      analysisResult = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("Invalid JSON response from AI");
    }

    console.log("Analysis completed:", { score: analysisResult.score, compatibility: analysisResult.compatibility, language });

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-resume function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
