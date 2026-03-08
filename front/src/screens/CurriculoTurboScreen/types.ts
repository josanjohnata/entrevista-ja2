export type AnalysisResult = {
  score: number;
  compatibility: 'low' | 'medium' | 'high';
  analysis: string;
  suggestions: string[];
  improvedResume: string | null;
  recommendation: string;
};

export type AnalyzedJob = {
  jobHash: string;
  score: number;
  suggestionsApplied: boolean;
  improvedResume: string | null;
};

export type ResultModalProps = {
  result: AnalysisResult;
  onClose: () => void;
  onApplySuggestions: () => void;
  onDownloadResume: () => void;
  canApplySuggestions: boolean;
  isMaxScore: boolean;
};
