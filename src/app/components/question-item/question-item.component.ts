import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { QuestionItem } from '../../core/questions/question.model';
import { QuestionsService } from '../../core/questions/questions.service';
import { AuthFacade } from '../../core/auth/auth.facade';

@Component({
  selector: 'app-question-item',
  standalone: true,
  templateUrl: './question-item.component.html', 
  styleUrls: ['./question-item.component.scss'] 
})
export class QuestionItemComponent {

  @Input({ required: true }) question!: QuestionItem;

  constructor(
    private questionsService: QuestionsService,
    private auth: AuthFacade,
    private dialog: MatDialog
  ) {}
}

