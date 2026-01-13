import { Answer } from './answer.model';

export interface QuestionItem {
  _id: string;
  question: string;
  categoryId: string;
  answers: Answer[];
  displayedAnswer: { text: string; userId?: string; _id?: string };
  defaultAnswer?: { text: string };
}

