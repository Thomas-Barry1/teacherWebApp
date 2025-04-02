export interface InlineGapAssessment {
    overallStrength: 'Strong' | 'Moderate' | 'Weak' | 'strong' | 'moderate' | 'weak' | null,
    performanceSummary: string,
    standardsPerformance: {
      standard: string;
      strength: 'Strong' | 'Moderate' | 'Weak' | 'strong' | 'moderate' | 'weak' | null;
      description: string;
    }[],
    improvementPlan: string
  }