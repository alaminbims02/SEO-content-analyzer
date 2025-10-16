export interface ComparisonDetail {
  version1: string;
  version2: string;
}

export interface KeywordDensity {
  keyword: string;
  density: string; // Using string to accommodate formats like "1.5%" or "5 times"
}

export interface QualitativePoint {
  point: string;
  version1: string;
  version2: string;
}

export interface KeywordStrategyAnalysis {
  qualitativePoints: QualitativePoint[];
  version1Keywords: KeywordDensity[];
  version2Keywords: KeywordDensity[];
}

export interface MetaContentAnalysis {
  version1: string;
  version2: string;
  scoreVersion1: number;
  scoreVersion2: number;
}

export interface AnalysisResult {
  winner: 'version1' | 'version2' | 'tie';
  summary: string;
  detailedAnalysis: {
    keywordStrategy: KeywordStrategyAnalysis;
    readabilityAndEngagement: ComparisonDetail;
    metaContent: MetaContentAnalysis;
    structureAndFlow: ComparisonDetail;
    callToAction: ComparisonDetail;
  };
  recommendations: string[];
  suggestedKeywords: string[];
  competitorAnalysis: string;
  rankingPrediction: string;
}