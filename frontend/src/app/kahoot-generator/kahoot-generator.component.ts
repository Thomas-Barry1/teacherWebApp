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
    const sections = response.trim().replaceAll("**", "").replaceAll("", "").split('\n\n');

    console.log("Sections: ", sections);

    let count = 1; // Help keep track of which line you're on
    let question = "";
    let answer1: string | null = "";
    let answer2: string | null = "";
    let answer3: string | null = "";
    let answer4: string | null = "";
    let timeLimit: number | null = -1;
    let correctAnswer: number | null = -1;
    sections.forEach(section => {
      console.log("Section Count in KahootComponent: ", count);

      // Split each section into individual lines
      const lines = section.split('\n').map(line => line.trim());
      console.log("Lines: ", lines);

      if(lines.length === 7){
        timeLimit = this.extractTimeLimit(lines[0])
        console.log("Time Limit: ", timeLimit);
        question = lines[1];
        console.log("Question: ", question);
        answer1 = this.extractPossibleAnswer(lines[2]);
        console.log("Answer1: ", answer1);
        answer2 = this.extractPossibleAnswer(lines[3]);
        console.log("Answer2: ", answer2);
        answer3 = this.extractPossibleAnswer(lines[4]);
        console.log("Answer3: ", answer3);
        answer4 = this.extractPossibleAnswer(lines[5]);
        console.log("Answer4: ", answer4);
        correctAnswer = this.extractCorrectAnswer(lines[6]);
        console.log("Correct Answer: ", correctAnswer);
        count = 6;
      }

      if (count === 1){
        // Used to skip the first line which is the title
        console.log("Count = 1");
        count = 2;
        return;
      } else if(count === 2) {
        if (lines.length === 6){
          timeLimit = this.extractTimeLimit(lines[0])
          console.log("Time Limit: ", timeLimit);
          question = lines[1];
          console.log("Question: ", question);
          answer1 = this.extractPossibleAnswer(lines[2]);
          console.log("Answer1: ", answer1);
          answer2 = this.extractPossibleAnswer(lines[3]);
          console.log("Answer2: ", answer2);
          answer3 = this.extractPossibleAnswer(lines[4]);
          console.log("Answer3: ", answer3);
          answer4 = this.extractPossibleAnswer(lines[5]);
          console.log("Answer4: ", answer4);
          count = 5; // Skip the next few counts to get the correct answer
        }else if(lines.length === 2) {
          timeLimit = this.extractTimeLimit(lines[0])
          console.log("Time Limit: ", timeLimit);
          question = lines[1];
          console.log("Question: ", question);
          count = 4; // Skip the next count to get the possible answers
        }else{
          timeLimit = this.extractTimeLimit(lines[0])
          console.log("Time Limit: ", timeLimit);
          count += 1;
        }
        if (timeLimit === -1){ // Bad input given, reset to first line
          count = 2;
        }
        return;
      } else if (count == 3){
        if(lines.length >= 5){
          question = lines[0];
          console.log("Question: ", question);
          answer1 = this.extractPossibleAnswer(lines[1]);
          console.log("Answer1: ", answer1);
          answer2 = this.extractPossibleAnswer(lines[2]);
          console.log("Answer2: ", answer2);
          answer3 = this.extractPossibleAnswer(lines[3]);
          console.log("Answer3: ", answer3);
          answer4 = this.extractPossibleAnswer(lines[4]);
          console.log("Answer4: ", answer4);

          if(lines.length >= 6){ // the last line is the correct answer
            correctAnswer = this.extractCorrectAnswer(lines[5]);
            console.log("Correct Answer: ", correctAnswer);
            count = 6; // Skip the next 2 counts to add the responses
          }else{
            count = 5; // Skip the next count to get correct answer
          }
        }else{
          question = lines[0];
          console.log("Question: ", question);
          count += 1;
        }
        return;
      }else if(count === 4) {
        // Extract all the possbile answers
        answer1 = this.extractPossibleAnswer(lines[0]);
        console.log("Answer1: ", answer1);
        answer2 = this.extractPossibleAnswer(lines[1]);
        console.log("Answer2: ", answer2);
        answer3 = this.extractPossibleAnswer(lines[2]);
        console.log("Answer3: ", answer3);
        answer4 = this.extractPossibleAnswer(lines[3]);
        console.log("Answer4: ", answer4);
        count += 1;

        if(answer1 === null){ // Bad input given, reset to first line
          count = 2;
        }
        return;
      }else if(count === 5) {
        correctAnswer = this.extractCorrectAnswer(lines[0]);
        console.log("Correct Answer: ", correctAnswer);
      }

      count = 2 // Reset to first line count
      let correctAnswerStr = correctAnswer + "";
      let timeLimitStr = timeLimit + "";
      if(correctAnswerStr === "-1" || answer1 === null || answer2 === null || 
        answer3 === null || question === null
      ){
        return; // Don't add bad values to the kahoot Excel sheet
      }

      // Need the names to be specific for Kahoot to parse them correctly
      // let QuestionNumbers = questionNumber;
      // let question = "";
      // let answer1: string | null = "";
      // let answer2: string | null = "";
      // let answer3: string | null = "";
      // let answer4: string | null = "";
      // let timeLimit: number | null = -1;
      // let correctAnswer: number | null = -1;

      //   // Push the parsed question into the array
      //   let object = {};
      //   object.set("QuestionNumbers", questionNumber);
      //   object["QuestionNumbers"] = questionNumber;
        parsedQuestions.push({
          question,
          answer1,
          answer2,
          answer3,
          answer4,
          timeLimitStr,
          correctAnswerStr
        });
    });

    return parsedQuestions;
  }

  // Helper method to extract time limit from the question string
  extractTimeLimit(questionString: string): number | null {
    let timeLimitMatch = questionString.match(/\(.* (\d+) seconds/);
    console.log("TimeLimitMatch: ", timeLimitMatch)
    
    if (timeLimitMatch && timeLimitMatch[1]) {
      return parseInt(timeLimitMatch[1], 10); // Convert matched time limit to an integer
    }else {
      let timeLimitMatch = questionString.match(/\(Time [Ll]imit: (\d+) seconds\)/);
      if (timeLimitMatch && timeLimitMatch[1]) {
        return parseInt(timeLimitMatch[1], 10); // Convert matched time limit to an integer
      }
    }
    return -1
  }

  // Helper method to extract answer from the question string
  extractQuestion(questionString: string): string | null {
    const answerMatch = questionString.match(/\(Question \d+: .*/);
    
    if (answerMatch && answerMatch[1]) {
      return answerMatch[1]; // Convert matched time limit to an integer
    }else {
      return null
    }
  }

  // Helper method to extract answer from the question string
  extractCorrectAnswer(questionString: string): number | null {
    const answerMatch = questionString.match(/Correct .*: (\d)+/);
    
    if (answerMatch && answerMatch[1]) {
      return parseInt(answerMatch[1], 10); // Convert matched time limit to an integer
    }else {
      return -1
    }
  }

  // Helper method to extract possible answer from the question string
  extractPossibleAnswer(questionString: string): string | null {
    const answerMatch = questionString.match(/^\d+\.\s*(.*)/);
    
    if (answerMatch && answerMatch[1]) {
      return answerMatch[1].trim(); // Return the captured answer text without leading/trailing spaces
    }
    
    return null; // Return null if format is not as expected
  }


}
