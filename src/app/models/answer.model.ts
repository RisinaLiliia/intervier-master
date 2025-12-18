export interface Answer {
  id: number;
  questionId: number;
  userId: number;
  text: string;
  updatedAt: string;
}

export interface QuestionWithAnswer {
  id: number;
  question: string;
  answer?: string;
}
