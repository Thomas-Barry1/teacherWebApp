import { Component } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StateService } from '../services/state.service';
import { MarkdownService } from '../services/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { Question } from '../shared/question.model';
import { InlineGapAssessment } from '../shared/inline_gap_assessment.models';
import { InlineGapAssessmentComponent } from '../inline-gap-assessment/inline-gap-assessment.component';
import { Assessment } from '../shared/asssessment.model';
import { Full_Question } from '../shared/full_question.model';

@Component({
  selector: 'app-gap-assessment',
  // imports: [],
  templateUrl: './gap-assessment.component.html',
  styleUrl: './gap-assessment.component.css',
})
export class GapAssessmentComponent {
  selectedFile: File | null = null;
  gapTestForm: FormGroup<any>;
  gapTest: SafeHtml = '';
  gapTestName: string = '';
  selectedAnswers: string[] = [];

  loading: boolean = false;
  testActive: boolean = false;
  testComplete: boolean = false;

  questions: Question[] = [];
  standards: any; //not sure types yet

  // Pass to the inline gap analysis
  assessment: InlineGapAssessment;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private stateService: StateService,
    private markdownService: MarkdownService
  ) {
    this.gapTestForm = this.fb.group({
      topic: [''],
      numberOfQuestions: [''],
      gradeLevel: [''],
      commonCoreStandards: [''],
      skills: [''],
      questionType: [''],
      state: [''],
    });

    // load existing data if available
    this.gapTest = this.stateService.getTestData();

    this.assessment = {
      overallStrength: 'Moderate',
      performanceSummary:
        'This student shows a significant discrepancy in their test performance, excelling in some areas and completely failing in others. This suggests a possible issue with understanding specific mathematical concepts rather than a general lack of mathematical ability. A plan needs to address both the strengths and weaknesses.',
      standardsPerformance: [
        {
          standard: 'K.OA.A.1',
          strength: 'Strong',
          description: 'Understanding addition and subtraction within 5',
        },
        {
          standard: '4.NF.A.1',
          strength: 'Strong',
          description: 'Understanding equivalent fractions',
        },
        {
          standard: '3.OA.A.7',
          strength: 'Strong',
          description: 'Multiplying and dividing numbers less than 100',
        },
        {
          standard: '3.MD.C.5',
          strength: 'Weak',
          description:
            'Understands concepts of area and relating area to multiplication and addition',
        },
        {
          standard: '5.0A.A.2',
          strength: 'Weak',
          description: 'Writing and interpreting numerical expressions',
        },
      ],
      improvementPlan:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }
  // createGapAssessment() {
  //   console.log('Sending to backend');
  //   this.apiService.generateGapAssessment(this.selectedFile).subscribe({
  //     next: (val) => {
  //       console.log('the service next call is here');
  //     },
  //   });
  //   console.log('returned from the backend call');
  // }

  // getFormData(): any {
  //   return this.gapTestForm.value;
  // }

  generateStandards() {
    this.loading = true;
    const formData = this.gapTestForm;

    this.apiService.generateStandards(formData).subscribe({
      next: async (response: any) => {
        console.log('Made it back to generate standards component');

        // store the standards for GAP assessment visualization later
        this.standards = response.standards;
        console.log('Generate standards api response: ', response.standards);
        2;
        // generate the test using the standards
        this.generateGapTest(formData, this.standards);
      },
      error: (error) => {
        console.error('Error generating standards from Gemini:', error);
        this.loading = false;
      },
    });
  }

  generateGapTest(formData: FormGroup, standards: any) {
    // const testRequest = {
    //   ...formData,
    //   standards: standards,
    // };

    formData.addControl("standards", new FormControl(standards));

    this.apiService.generateGapTest(formData).subscribe({
      next: async (response: any) => {
        console.log('Raw API Response:', response);
        if (formData.get("state") !== null && formData.get("gradeLevel") !== null){
          this.gapTestName = `${formData.get("state")!.value} ${formData.get("gradeLevel")!.value} Grade Level Test`;
        } else {
          this.gapTestName = `${formData.get("topic")!.value} Test`;
        }

        this.questions = this.parseApiResponse(response);
        localStorage.setItem('questions', JSON.stringify(this.questions));
        localStorage.setItem('selectedAnswers', JSON.stringify([]));
        console.log(this.questions);
      },
      error: (error) => {
        console.error('Error creating gap test:', error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  parseApiResponse(response: any): Question[] {
    let questionsArray;

    // If response.test is already an array, use it directly
    if (Array.isArray(response.test)) {
      questionsArray = response.test;
    }
    // If response.test is a string, try parsing it
    else if (typeof response.test === 'string') {
      try {
        // Extract JSON if it's wrapped in markdown format (```json ... ```)
        const jsonMatch = response.test.match(/```json\n([\s\S]+)\n```/);
        const jsonString = jsonMatch ? jsonMatch[1] : response.test;

        questionsArray = JSON.parse(jsonString);
      } catch (error) {
        throw new Error('Failed to parse JSON from response.test');
      }
    } else {
      throw new Error('Invalid response format');
    }

    // Transform data into the required format
    return questionsArray.map(
      (q: any): Question => ({
        question: q.Question,
        answerChoices: q.AnswerChoices,
        correctAnswer: q.CorrectAnswer,
      })
    );
  }

  beginTest() {
    this.testActive = true;
    this.generateStandards();
  }

  finishTest(event: {assessment: Assessment, selected_answers: Full_Question[]}) {
    console.log('Received event from child:', event);
    this.assessment = event.assessment.gap_assessment;
    this.selectedAnswers = event.selected_answers.map(answer => answer.selected_answer === null ? '' : answer.selected_answer);
    this.testActive = false;
    this.testComplete = true;
  }
}
