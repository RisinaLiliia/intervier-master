import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { QuestionItem } from '../../models/question.model';
import { QuestionsService } from '../../services/questions.service';
import { AuthFacade } from '../../core/auth/auth.facade';
import { AuthRequiredModalComponent } from '../auth-required-modal/auth-required.modal';

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

