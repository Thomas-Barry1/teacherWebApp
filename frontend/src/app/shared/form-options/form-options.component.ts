import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-form-options',
  // standalone: true,
  // imports: [MatFormFieldModule],
  templateUrl: './form-options.component.html',
  styleUrl: './form-options.component.css'
})
export class FormOptionsComponent {
  @Input()
  parentFormGroup!: FormGroup;

  // Define inputs to control visibility
  @Input() showNumberOfQuestions: boolean = true;
  @Input() showGradeLevel: boolean = true;
  @Input() showCommonCoreStandards: boolean = true;
  @Input() showSkills: boolean = true;
  @Input() showQuestionTypes: boolean = false;

  questionTypes: string[] = ['Multiple Choice', 'True/False', 'Short Answer', 'Long Answer', 'Bonus Question'];
}
