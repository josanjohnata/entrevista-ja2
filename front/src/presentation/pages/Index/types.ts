export type AnalysisResult = {
  score: number;
  compatibility: 'low' | 'medium' | 'high';
  analysis: string;
  suggestions: string[];
  improvedResume: string | null;
  recommendation: string;
}

export type AnalyzedJob = {
  jobHash: string;
  score: number;
  suggestionsApplied: boolean;
  improvedResume: string | null;
}

export type AnalysisResultProps = {
  result: AnalysisResult;
  onApplySuggestions: () => void;
  onBack: () => void;
  onDownloadResume: () => void;
  canApplySuggestions: boolean;
  isMaxScore: boolean;
}

export type IndexPageProps = {
  onShowResultChange?: (showResult: boolean) => void;
}
