export interface AuditReport {
  url: string;
  date: string;
  overallScore: number;
  performanceScore: number;
  contentQualityScore: number;
  mobileOptimizationScore: number;
  userExperienceScore: number;
  technicalSEOScore: number;
  insights: {
    metaTitle: string;
    metaDescription: string;
    headingStructure: string;
    keywordOptimization: string;
    internalLinking: string;
    contentReadability: string;
    callToAction: string;
    mobileResponsiveness: string;
    pageSpeed: string;
    accessibility: string;
  };
  recommendations: {
    priority: "critical" | "important" | "quick-win" | "long-term";
    title: string;
    description: string;
  }[];
}

export interface CompetitorAnalysis {
  strengths: string[];
  weaknesses: string[];
  contentGaps: string[];
  keywordOpportunities: string[];
  roadmap: string[];
}
