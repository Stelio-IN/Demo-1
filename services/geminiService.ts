import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const model = 'gemini-2.5-flash';

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    verdict: {
      type: Type.STRING,
      description: "Nível de risco: 'Risco Alto', 'Risco Médio', 'Risco Baixo', ou 'Seguro'.",
    },
    explanation: {
      type: Type.STRING,
      description: "Explicação detalhada da análise e dos sinais de alerta identificados.",
    },
    recommendation: {
      type: Type.STRING,
      description: "Próximos passos para o usuário, como bloquear a pessoa ou contatar as autoridades.",
    },
  },
  required: ['verdict', 'explanation', 'recommendation'],
};

const getAnalysisPrompt = (mode: 'text' | 'image') => {
  const basePrompt = "Analise o conteúdo a seguir em busca de sinais de tráfico de pessoas, aliciamento, atividade fraudulenta ou manipulação. Forneça uma resposta estruturada em JSON. ";
  if (mode === 'image') {
    return basePrompt + "A imagem fornecida pode ser parte de uma tentativa de aliciamento ou fraude. Examine pistas de contexto, elementos suspeitos ou qualquer coisa que pareça fora do lugar.";
  }
  return basePrompt + "A mensagem de texto fornecida pode ser uma tentativa de golpe ou aliciamento.";
};

export const analyzeContent = async (
  text: string,
  image?: { mimeType: string; data: string }
): Promise<AnalysisResult> => {
  try {
    const prompt = getAnalysisPrompt(image ? 'image' : 'text');
    // FIX: Refactored prompt construction for image analysis to combine text parts and handle optional context.
    const contents = image
      ? { parts: [{ text: `${prompt}${text ? `\n\nContexto adicional: "${text}"` : ''}` }, { inlineData: image }] }
      : { parts: [{ text: `${prompt}\n\nMensagem: "${text}"` }] };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    // Sometimes the response might be wrapped in ```json ... ```
    const cleanedJsonText = jsonText.replace(/^```json\n?/, '').replace(/\n?```$/, '');
    const result = JSON.parse(cleanedJsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // Let the component handle the user-facing error message for i18n
    throw new Error("Failed to analyze content.");
  }
};
