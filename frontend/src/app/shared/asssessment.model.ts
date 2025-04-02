import { InlineGapAssessment } from "./inline_gap_assessment.models";

export interface Assessment {
    category_final_grades: Record<string, number>;
    gap_assessment: InlineGapAssessment
  }
  