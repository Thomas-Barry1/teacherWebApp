import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../services/ai.service';
import { MarkdownService } from '../services/markdown.service';
import { SafeHtml } from '@angular/platform-browser';

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
  loading: boolean = false;

  constructor(private fb: FormBuilder, 
    private aiService: AiService, 
    private markdownService: MarkdownService) {
    this.lessonForm = this.fb.group({
      topic: ['']
    });
  }

  generateLessonPlan(): void {
    this.loading = true;
    const topic = this.lessonForm.value.topic;
    this.aiService.generateLessonPlan(topic).subscribe(async response => {
      this.lessonPlan = await this.markdownService.convert(response.lessonPlan);
      this.loading = false;
    }, error => {
      console.error('Error generating lesson plan', error);
      this.loading = false;
    });
  }
}

