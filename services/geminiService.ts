import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { AnalysisResult } from '../types';

type GeminiImportMetaEnv = {
  VITE_GEMINI_API_KEY?: string;
  GEMINI_API_KEY?: string;
};

const getGeminiApiKey = (): string | undefined => {
  const viteEnv = (import.meta as ImportMeta & { env?: GeminiImportMetaEnv }).env;

  return (
    viteEnv?.VITE_GEMINI_API_KEY ||
    viteEnv?.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY ||
    process.env.API_KEY
  );
};

const getAiClient = (): GoogleGenAI => {
  const apiKey = getGeminiApiKey();

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  return new GoogleGenAI({ apiKey });
};

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
      description: "Explicação detalhada da análise e dos sinais de alerta identificados, considerando todos os fatores.",
    },
    recommendation: {
      type: Type.STRING,
      description: "Próximos passos para o usuário, como bloquear a pessoa, não compartilhar informações ou contatar as autoridades.",
    },
  },
  required: ['verdict', 'explanation', 'recommendation'],
};

const getAnalysisPrompt = (mode: 'text' | 'image', location?: string, sender?: string) => {
  return `
    You are a highly specialized AI analyst with expertise in identifying human trafficking, fraudulent schemes, and online enticement. Your task is to conduct a thorough risk analysis of the following content.

    **Analysis Framework:**
    Evaluate the content based on these critical factors:
    1.  **Message Content:** Analyze the language for tone, urgency, promises (especially if they seem too good to be true), and inconsistencies.
    2.  **Deception Techniques:** Identify common tactics like fraudulent job offers, romantic enticement ('loverboy' tactic), threats, isolation methods, or requests for money/personal documents.
    3.  **Proposal Structure:** Assess the professionalism. Is the offer vague? Does it lack verifiable details like a legitimate company name, address, or contact information?
    4.  **Sender Information:** ${sender ? `The sender is identified as: "${sender}". Assess if this information seems credible or suspicious.` : 'No sender information was provided.'}
    5.  **Geolocation:** ${location ? `The offer is associated with this location: "${location}". Cross-reference this with known human trafficking hotspots or routes. Be aware of regions known for specific types of exploitation.` : 'No location was provided.'}
    6.  **Contextual Risks:** Consider if the situation aligns with known patterns, such as targeting vulnerable populations or leveraging specific events/times of the year (e.g., major sporting events, holidays) for recruitment.

    Provide your analysis in a structured JSON format.
  `;
};

export const isGeminiConfigured = (): boolean => Boolean(getGeminiApiKey());

export const createReportChat = (systemInstruction: string) => {
  return getAiClient().chats.create({
    model,
    config: {
      systemInstruction,
    },
  });
};

export const analyzeContent = async (
  text: string,
  image?: { mimeType: string; data: string },
  location?: string,
  sender?: string
): Promise<AnalysisResult> => {
  try {
    const ai = getAiClient();
    const prompt = getAnalysisPrompt(image ? 'image' : 'text', location, sender);
    
    const fullTextPrompt = `${prompt}\n\n---START OF CONTENT TO ANALYZE---\nContext/Message: "${text || '(No text provided)'}"\n---END OF CONTENT TO ANALYZE---`;

    // FIX: Explicitly type `parts` as an array that can contain both text and image parts to resolve type inference issue.
    const parts: ({ text: string; } | { inlineData: { mimeType: string; data: string; }; })[] = [{ text: fullTextPrompt }];
    if (image) {
      parts.push({ inlineData: image });
    }
    const contents = { parts };


    const response: GenerateContentResponse = await ai.models.generateContent({
      model: model,
      contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1,
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