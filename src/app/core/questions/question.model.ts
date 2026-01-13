
export interface QuestionItem {
  _id: string;
  question: string;
  categoryId: string;
  answers: Answer[];
  displayedAnswer: { text: string; userId?: string; _id?: string };
  defaultAnswer?: { text: string };
}

export interface Answer {
  _id: string;
  questionId: string;
  userId: string;
  text: string;
  updatedAt: string;
}

export interface AnswerItem {
  _id?: string;     
  userId?: string;   
  text: string;      
}
export interface EditAnswerDialogData {
  _id: string;              
  question: string;
  answers: Answer[];        
  currentUserId: string;     
}