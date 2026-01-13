import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { CategoryService } from '../categories/categories.service';

@Injectable({ providedIn: 'root' })
export class QuestionsFacade {
  constructor(private service: CategoryService) {}

  load(categoryId: string, userId?: string) {
    return this.service.getQuestions(categoryId).pipe(
      map(questions =>
        questions.map(q => {
          const userAnswer = q.answers.find(a => a.userId === userId);
          const defaultAnswer = q.answers.find(a => !a.userId);
          return {
            ...q,
            displayedAnswer: userAnswer ?? defaultAnswer ?? { text: '' },
          };
        })
      )
    );
  }
}
