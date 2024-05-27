import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-lesson-plan-generator',
  templateUrl: './lesson-plan-generator.component.html',
  styleUrls: ['./lesson-plan-generator.component.css']
})
export class LessonPlanGeneratorComponent {
  topic = '';
  gradeLevel = '';
  duration: number | null = null;
  lessonPlan: string | null = null;

  constructor(private apiService: ApiService) { }

  generateLessonPlan() {
    const requestData = {
      topic: this.topic,
      grade_level: this.gradeLevel,
      duration: this.duration
    };
    this.apiService.generateLessonPlan(requestData).subscribe(response => {
      this.lessonPlan = response.content;
    });
  }
}

