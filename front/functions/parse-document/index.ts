const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Internationalized error messages
const errorMessages: Record<string, { insufficientText: string; processingError: string }> = {
  pt: {
    insufficientText: 'Não foi possível extrair texto suficiente do arquivo. Por favor, copie e cole o texto manualmente.',
    processingError: 'Erro ao processar documento. Por favor, copie e cole o texto manualmente.'
  },
  en: {
    insufficientText: 'Could not extract enough text from the file. Please copy and paste the text manually.',
    processingError: 'Error processing document. Please copy and paste the text manually.'
  },
  es: {
    insufficientText: 'No se pudo extraer suficiente texto del archivo. Por favor, copia y pega el texto manualmente.',
    processingError: 'Error al procesar el documento. Por favor, copia y pega el texto manualmente.'
  },
  fr: {
    insufficientText: 'Impossible d\'extraire suffisamment de texte du fichier. Veuillez copier et coller le texte manuellement.',
    processingError: 'Erreur lors du traitement du document. Veuillez copier et coller le texte manuellement.'
  },
  ru: {
    insufficientText: 'Не удалось извлечь достаточно текста из файла. Пожалуйста, скопируйте и вставьте текст вручную.',
    processingError: 'Ошибка при обработке документа. Пожалуйста, скопируйте и вставьте текст вручную.'
  },
  ar: {
    insufficientText: 'لم يتمكن من استخراج نص كافٍ من الملف. يرجى نسخ ولصق النص يدوياً.',
    processingError: 'خطأ في معالجة المستند. يرجى نسخ ولصق النص يدوياً.'
  },
  zh: {
    insufficientText: '无法从文件中提取足够的文本。请手动复制粘贴文本。',
    processingError: '处理文档时出错。请手动复制粘贴文本。'
  },
  hi: {
    insufficientText: 'फ़ाइल से पर्याप्त टेक्स्ट निकालने में असमर्थ। कृपया टेक्स्ट को मैन्युअल रूप से कॉपी और पेस्ट करें।',
    processingError: 'दस्तावेज़ प्रोसेस करने में त्रुटि। कृपया टेक्स्ट को मैन्युअल रूप से कॉपी और पेस्ट करें।'
  },
  bn: {
    insufficientText: 'ফাইল থেকে পর্যাপ্ত টেক্সট বের করা সম্ভব হয়নি। অনুগ্রহ করে ম্যানুয়ালি টেক্সট কপি এবং পেস্ট করুন।',
    processingError: 'ডকুমেন্ট প্রসেস করতে সমস্যা। অনুগ্রহ করে ম্যানুয়ালি টেক্সট কপি এবং পেস্ট করুন।'
  },
  id: {
    insufficientText: 'Tidak dapat mengekstrak teks yang cukup dari file. Silakan salin dan tempel teks secara manual.',
    processingError: 'Kesalahan saat memproses dokumen. Silakan salin dan tempel teks secara manual.'
  }
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { file, filename, language = 'pt' } = await req.json();
    const messages = errorMessages[language] || errorMessages.en;

    if (!file || !filename) {
      return new Response(
        JSON.stringify({ error: 'File and filename are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Decode base64 to binary
    const binaryString = atob(file);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    let extractedText = '';

    // Simple text extraction for PDF (looking for text between stream markers)
    if (filename.toLowerCase().endsWith('.pdf')) {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const text = decoder.decode(bytes);
      
      // Basic PDF text extraction - looks for readable text
      const textMatches = text.match(/\(([^)]+)\)/g);
      if (textMatches) {
        extractedText = textMatches
          .map(match => match.slice(1, -1))
          .join(' ')
          .replace(/\\n/g, '\n')
          .replace(/\\/g, '');
      }
    } 
    // For DOCX - basic extraction (DOCX is a zip file)
    else if (filename.toLowerCase().endsWith('.docx')) {
      const decoder = new TextDecoder('utf-8', { fatal: false });
      const text = decoder.decode(bytes);
      
      // Try to find text content in the XML structure
      const textMatches = text.match(/<w:t[^>]*>([^<]+)<\/w:t>/g);
      if (textMatches) {
        extractedText = textMatches
          .map(match => {
            const content = match.match(/>([^<]+)</);
            return content ? content[1] : '';
          })
          .join(' ');
      }
    }

    if (!extractedText || extractedText.length < 50) {
      return new Response(
        JSON.stringify({ 
          error: messages.insufficientText,
          text: ''
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ text: extractedText }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    
    // Try to get language from request, fallback to 'pt'
    let language = 'pt';
    try {
      const body = await req.clone().json();
      language = body.language || 'pt';
    } catch {}
    
    const messages = errorMessages[language] || errorMessages.en;
    
    return new Response(
      JSON.stringify({ 
        error: messages.processingError,
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
