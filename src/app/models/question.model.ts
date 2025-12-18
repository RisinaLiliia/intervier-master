export interface QuestionItem {
  id: number;
  question: string;
  answer?: string;
  categoryId: number;
}

export interface CategoryItem {
  id: number;
  name: string;
}

export interface ResponseArray<T> {
  data: T[];
  error?: string;
}
