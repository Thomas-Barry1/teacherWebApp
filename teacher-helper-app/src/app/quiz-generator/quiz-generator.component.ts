import { Component } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-quiz-generator',
  templateUrl: './quiz-generator.component.html',
  styleUrls: ['./quiz-generator.component.css']
})
export class QuizGeneratorComponent {
  topic = '';
  gradeLevel = '';
  numQuestions: number | null = null;
  quiz: string | null = null;

  constructor(private apiService: ApiService) { }

  generateQuiz() {
    const requestData = {
      topic: this.topic,
      grade_level: this.gradeLevel,
      num_questions: this.numQuestions
    };
    this.apiService.generateQuiz(requestData).subscribe(response => {
      this.quiz = response.questions;
    });
  }
}
