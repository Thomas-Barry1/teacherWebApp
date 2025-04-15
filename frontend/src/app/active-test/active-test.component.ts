import { Component, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Question } from '../shared/question.model';
import { EventEmitter } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Full_Question } from '../shared/full_question.model';
import { Assessment } from '../shared/asssessment.model';

@Component({
  selector: 'app-active-test',
  //standalone: true,
  //imports: [],
  templateUrl: './active-test.component.html',
  styleUrl: './active-test.component.css',
})
export class ActiveTestComponent {
  @Output() taskCompleted = new EventEmitter<{assessment: Assessment, selected_answers: Full_Question[]}>();
  @Output() answersSelected = new EventEmitter<Full_Question[]>();
  @Input() questions: Question[] = [];
  currentQuestionIndex: number = 0;
  selectedAnswer: string | null = null;
  selectedAnswers: Full_Question[] = [];

  @Input() numberOfQuestions: number = 0;
  timeRemaining: number = 1800; // TO DO: create formula that calculates time or add it as input
  interval: any;
  //testStages = ['user-info', 'questions', 'completion'];
  currentStage = '';
  userInfoForm: FormGroup; // TO DO: connect user data to backend
  assessment?: Assessment;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
    this.userInfoForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      teacherCode: [''],
    });
    this.currentStage = 'user-info';
    // this.selectedAnswers = Array(this.numberOfQuestions).fill(null);
  }

  onSubmitUserData() {
    this.currentStage = 'questions';
    this.startTimer();
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = null;
      console.log("Selected answers:", this.selectedAnswers);
    } else {
      //submitting
      const send_data:Full_Question[] = this.selectedAnswers;
      console.log("Sending this data to create gap_assessment:", send_data);
      this.apiService.generateGapAssessment(send_data).subscribe({
        next: async (response: any )=>{
          console.log("Response from generating gap assessment: ", response);
          this.assessment = response;
          console.log("Selected answers: ", this.selectedAnswers);
          this.taskCompleted.emit({assessment: response, selected_answers: this.selectedAnswers});
        }
      })
      
      this.currentStage = 'completion';
    }
  }

  prevQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedAnswer = null;
    }
  }

  selectAnswer(answer: string) {
    this.selectedAnswer = answer;
    this.selectedAnswers[this.currentQuestionIndex] = {
      question: this.questions[this.currentQuestionIndex],
      selected_answer: this.selectedAnswer
    };
    localStorage.setItem(
      'selectedAnswers',
      JSON.stringify(this.selectedAnswers)
    );
  }

  startTimer() {
    this.interval = setInterval(() => {
      if (this.timeRemaining > 0) {
        this.timeRemaining--;
      } else {
        clearInterval(this.interval);
      }
    }, 1000);
  }

  getFormattedTime(): string {
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Ensures two-digit seconds
  }

  // TODO: Implement exit test
  exitTest() {
    localStorage.setItem('selectedAnswers', JSON.stringify([]));
    localStorage.setItem('questions', JSON.stringify([]));

    console.log('Test Exited');
  }
  show(){
    console.log(this.selectedAnswers); 
    console.log(this.selectedAnswers.length);
    console.log(this.questions.length);
  }
}
