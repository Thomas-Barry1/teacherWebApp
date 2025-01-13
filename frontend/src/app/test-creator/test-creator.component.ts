import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MarkdownService } from '../services/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { saveAs } from "file-saver"
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as domToImage from 'dom-to-image'
import * as moment from 'moment';
import { OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-test-creator',
  // standalone: true,
  // imports: [FormOptionsComponent],
  templateUrl: './test-creator.component.html',
  styleUrl: './test-creator.component.css'
})
export class TestCreatorComponent {
  testForm: FormGroup;
  test: SafeHtml = '';
  testString = ''
  loading: boolean = false;
  editTest: boolean = false;
  questionTypes: string[] = [''];

  @ViewChild('dataToExport', { static: false })
  public dataToExport!: ElementRef;

  constructor(private fb: FormBuilder, private apiService: ApiService, private markdownService: MarkdownService, private stateService: StateService) {
    this.testForm = this.fb.group({
      topic: [''],
      numberOfQuestions: [''],
      gradeLevel: [''],
      commonCoreStandards: [''],
      skills: [''],
      questionType: [this.questionTypes],
      state: ['']
    });

    // Load existing data if available
    this.test = this.stateService.getTestData();
  }

  generateTest(): void {
    this.loading = true;
    // const topic = this.testForm.value.topic;
    const formData = this.testForm.value;
    // var object = this.testForm.getRawValue();
    // console.log("Object: ", object);
    // var jsonStr = JSON.stringify(object);
    // console.log("Json str: ", jsonStr);
    // console.log("Json stringify: ", JSON.stringify(this.testForm.value));
    this.apiService.generateTest(formData).subscribe(async response => {
      console.log("AI response: ", response);
      this.testString = await this.markdownService.convertHtml(response.test);
      console.log("HTML of Response: ", this.testString);
      this.test = await this.markdownService.convert(response.test);
      console.log("Test response: ", this.test);
      this.stateService.setTestData(this.test);
      this.loading = false;
    }, error => {
      console.error('Error generating test', error);
      this.loading = false;
    });
  }

  // Method to handle user edits
  async onContentChange(event: Event) {
    this.editTest = true;
  }

  saveTest() {
    this.editTest = false;

    const editedHtml = this.dataToExport.nativeElement.innerHTML
    // TODO: sanitize updated HTML to ensure safety
    this.test = editedHtml;
    this.stateService.setTestData(editedHtml);

    // Convert sanitized HTML to markdown
    this.testString = editedHtml.toString();
    console.log("New test string: ", this.testString);
    }
}