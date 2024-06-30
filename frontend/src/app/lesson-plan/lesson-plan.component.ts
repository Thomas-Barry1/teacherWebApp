import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../ai.service';

@Component({
  selector: 'app-lesson-plan',
  // standalone: true,
  // imports: [],
  templateUrl: './lesson-plan.component.html',
  styleUrls: ['./lesson-plan.component.css']
})
export class LessonPlanComponent {
  lessonForm: FormGroup;
  lessonPlan: string = '';

  constructor(private fb: FormBuilder, private chatGptService: AiService) {
    this.lessonForm = this.fb.group({
      topic: ['']
    });
  }

  generateLessonPlan(): void {
    const topic = this.lessonForm.value.topic;
    this.chatGptService.generateLessonPlan(topic).subscribe(response => {
      this.lessonPlan = response.choices[0].text;
    });
  }
}

