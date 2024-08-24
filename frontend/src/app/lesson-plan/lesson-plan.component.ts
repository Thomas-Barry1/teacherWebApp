import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../services/ai.service';
import { MarkdownService } from '../services/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-lesson-plan',
  // standalone: true,
  // imports: [],
  templateUrl: './lesson-plan.component.html',
  styleUrls: ['./lesson-plan.component.css']
})
export class LessonPlanComponent {
  lessonForm: FormGroup;
  lessonPlan: SafeHtml = '';
  lessonString: string = '';
  loading: boolean = false;

  constructor(private fb: FormBuilder, 
    private aiService: AiService, 
    private markdownService: MarkdownService,
    private stateService: StateService) {
    this.lessonForm = this.fb.group({
      topic: [''],
      gradeLevel: [''],
      commonCoreStandards: [''],
      skills: [''],
    });
    // Load existing data if available
    this.lessonPlan = this.stateService.getLessonPlanData();
  }

  generateLessonPlan(): void {
    this.loading = true;
    const topic = this.lessonForm.value;
    this.aiService.generateLessonPlan(topic).subscribe(async response => {
      this.lessonString = await this.markdownService.convertHtml(response.lessonPlan);
      this.lessonPlan = await this.markdownService.convert(response.lessonPlan);
      this.stateService.setLessonPlanData(this.lessonPlan);
      this.loading = false;
    }, error => {
      console.error('Error generating lesson plan', error);
      this.loading = false;
    });
  }
}

