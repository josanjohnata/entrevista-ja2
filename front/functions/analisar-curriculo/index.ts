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
    const { curriculo, vaga } = await req.json();

    if (!curriculo || !vaga) {
      return new Response(
        JSON.stringify({ error: "Currículo e vaga são obrigatórios" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY não configurada");
      return new Response(
        JSON.stringify({ error: "Configuração do servidor incompleta" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const systemPrompt = `Você é um especialista em recrutamento e recursos humanos (Tech Recruiter) focado no mercado brasileiro. Sua especialidade é analisar currículos e compará-los com descrições de vagas para ajudar candidatos a otimizar suas chances.

Sua tarefa:
1. Analise o currículo do candidato
2. Compare com a descrição da vaga
3. Gere um score de compatibilidade (0-100)
4. Identifique as 10 principais palavras-chave da vaga que faltam no currículo
5. Crie um resumo profissional otimizado (2-3 frases) focado na vaga
6. Sugira 3 melhorias mostrando como REESCREVER trechos do currículo. Para cada sugestão, mostre ANTES (texto original) e DEPOIS (texto reescrito otimizado).

Retorne APENAS um objeto JSON válido (sem markdown, sem explicações) com esta estrutura:
{
  "placar": número de 0 a 100,
  "palavrasChaveFaltando": "palavra1, palavra2, palavra3, ...",
  "resumoOtimizado": "texto do resumo profissional",
  "sugestoesMelhoria": "**[Título da Experiência]**\\nANTES: \\"[texto original]\\"\\nDEPOIS: \\"[texto reescrito]\\"\\n\\n**[Título 2]**\\nANTES: \\"...\\"\\nDEPOIS: \\"...\\""
}`;

    const userPrompt = `CURRÍCULO DO CANDIDATO:
${curriculo}

DESCRIÇÃO DA VAGA:
${vaga}

Analise e retorne o JSON com os resultados.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro do AI Gateway:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos em Settings → Workspace → Usage." }),
          {
            status: 402,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: "Erro ao processar análise" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Resposta vazia da IA");
    }

    // Parse the JSON from AI response (remove markdown if present)
    let analysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      analysisResult = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error("Erro ao fazer parse da resposta:", content);
      throw new Error("Formato de resposta inválido");
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Erro na função:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Erro desconhecido" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
