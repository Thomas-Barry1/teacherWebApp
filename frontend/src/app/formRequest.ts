export interface FormRequest {
  id: number;
  name: string;
  topic: string;
  numberOfQuestions: string | null;
  gradeLevel: string| null;
  commonCoreStandards: string | null;
  skills: string | null;
  questionType: string | null;
}