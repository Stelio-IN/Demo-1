
export interface AnalysisResult {
  verdict: string;
  explanation: string;
  recommendation: string;
}

export type VerificationMode = 'text' | 'image';
