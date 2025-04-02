import { Question } from "./question.model";

export interface Full_Question {
    question: Question,
    selected_answer: string | null
}