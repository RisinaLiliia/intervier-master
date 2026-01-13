
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

