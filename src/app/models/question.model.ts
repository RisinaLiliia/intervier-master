import { Answer } from './answer.model';


export interface QuestionItem {
  _id: string;
  question: string;
  categoryId: string;
  answers?: Answer[];  
  answer?: string;    
  answerId?: string;   
}
