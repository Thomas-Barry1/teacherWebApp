import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SafeHtml } from '@angular/platform-browser';
import { ApiService } from '../services/api.service';
import { MarkdownService } from '../services/markdown.service';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-kahoot-generator',
  // standalone: true,
  // imports: [],
  templateUrl: './kahoot-generator.component.html',
  styleUrl: './kahoot-generator.component.css'
})
export class KahootGeneratorComponent {

  kahootForm: FormGroup;
  kahoot: SafeHtml = '';
  kahootString = ''
  loading: boolean = false;
  questionTypes: string[] = [''];
  parsedQuestions: any[] = [];

  @ViewChild('dataToExport', { static: false })
  public dataToExport!: ElementRef;

  constructor(private fb: FormBuilder, private apiService: ApiService, private markdownService: MarkdownService, private stateService: StateService) {
    this.kahootForm = this.fb.group({
      topic: [''],
      numberOfQuestions: [''],
      gradeLevel: [''],
      commonCoreStandards: [''],
      skills: [''],
      questionType: ["Multiple choice"],
      state: ['']
    });

    // Load existing data if available
    this.kahoot = this.stateService.getTestData();
  }

  generateKahoot(): void {
    this.loading = true;
    // const topic = this.testForm.value.topic;
    const formData = this.kahootForm.value;
    // var object = this.testForm.getRawValue();
    // console.log("Object: ", object);
    // var jsonStr = JSON.stringify(object);
    // console.log("Json str: ", jsonStr);
    // console.log("Json stringify: ", JSON.stringify(this.testForm.value));
    this.apiService.generateKahoot(formData).subscribe(async response => {
      console.log("AI response: ", response);
      this.kahootString = await this.markdownService.convertHtml(response.kahoot);
      console.log("HTML of Response: ", this.kahootString);

      this.parsedQuestions=this.parseAiResponse(response.kahoot);
      console.log("ParsedQuestions", this.parsedQuestions);

      this.kahoot = await this.markdownService.convert(response.kahoot);
      console.log("Test response: ", this.kahoot);
      this.stateService.setTestData(this.kahoot);
      this.loading = false;
    }, error => {
      console.error('Error generating lesson plan', error);
      this.loading = false;
    });
  }

  // Method to parse the AI response and extract questions and answers
  parseAiResponse(response: string): any[] {
    console.log("Inside Parse AI Response Method.");
    const parsedQuestions: any[] = [];
    
    // Split the AI response by double new lines to separate questions
    const sections = response.trim().replaceAll("**", "").replaceAll("-", "").split('\n\n');

    console.log("Sections: ", sections);

    let count = 0;
    let question = "";
    let answer1: string | null = "";
    let answer2: string | null = "";
    let answer3: string | null = "";
    let answer4: string | null = "";
    let timeLimit: number | null = 0;
    sections.forEach(section => {
      // Help keep track of which line you're on
      count += 1;

      // Split each section into individual lines
      const lines = section.split('\n').map(line => line.trim());
      console.log("Lines: ", lines);

      if (count === 1){
        console.log("Count = 1");
        return;
      } else if(count === 2) {
        timeLimit = this.extractTimeLimit(lines[0]);
        console.log("Time limit: ", timeLimit);
        return;
      } else if (count == 3){
        if (lines.length >= 2){
          question = lines[0];
          answer1 = this.extractPossibleAnswer(lines[1]);
          answer2 = this.extractPossibleAnswer(lines[2]);
          answer3 = this.extractPossibleAnswer(lines[3]);
          answer4 = this.extractPossibleAnswer(lines[4]);
          count += 1; // Skip the next count
        }else {
          question = lines[0];
          console.log("Question: ", question);
        }
        return;
      }else if(count === 4) {
        // Check if the section has at least 2 lines
        if (lines.length >= 5) {
          question = lines[0];
          answer1 = this.extractPossibleAnswer(lines[1]);
          answer2 = this.extractPossibleAnswer(lines[2]);
          answer3 = this.extractPossibleAnswer(lines[3]);
          answer4 = this.extractPossibleAnswer(lines[4]);
        }else {
          answer1 = this.extractPossibleAnswer(lines[0]);
          answer2 = this.extractPossibleAnswer(lines[1]);
          answer3 = this.extractPossibleAnswer(lines[2]);
          answer4 = this.extractPossibleAnswer(lines[3]);
        }
        return;
      }
      count = 2; // Reset since the next option will be the time limit

        // Push the parsed question into the array
        parsedQuestions.push({
          question,
          answer1,
          answer2,
          answer3,
          answer4,
          timeLimit,
        });
    });

    return parsedQuestions;
  }

  // Helper method to extract time limit from the question string
  extractTimeLimit(questionString: string): number | null {
    let timeLimitMatch = questionString.match(/\(Time: (\d+) seconds\)/);
    
    if (timeLimitMatch && timeLimitMatch[1]) {
      return parseInt(timeLimitMatch[1], 10); // Convert matched time limit to an integer
    }else {
      let timeLimitMatch = questionString.match(/\(Time Limit: (\d+) seconds\)/);
      if (timeLimitMatch && timeLimitMatch[1]) {
        return parseInt(timeLimitMatch[1], 10); // Convert matched time limit to an integer
      return -1
    }
  }

  // Helper method to extract answer from the question string
  extractQuestion(questionString: string): number | null {
    const answerMatch = questionString.match(/\(Question (\d+): (\d+)\)/);
    
    if (answerMatch && answerMatch[1]) {
      return parseInt(answerMatch[1], 10); // Convert matched time limit to an integer
    }else {
      return -1
    }
  }

  // Helper method to extract answer from the question string
  extractCorrectAnswer(questionString: string): number | null {
    const answerMatch = questionString.match(/\(Correct Answer: (\d+)\)/);
    
    if (answerMatch && answerMatch[1]) {
      return parseInt(answerMatch[1], 10); // Convert matched time limit to an integer
    }else {
      return -1
    }
  }

  // Helper method to extract possible answer from the question string
  extractPossibleAnswer(questionString: string): string | null {
    const answerMatch = questionString.split(" ");
    
    if (answerMatch && answerMatch[1]) {
      return answerMatch[1]; // Convert matched time limit to an integer
    }else {
      return ""
    }
  }


}
