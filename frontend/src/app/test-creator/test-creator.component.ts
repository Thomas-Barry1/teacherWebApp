import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../services/ai.service';
import { MarkdownService } from '../services/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { saveAs } from "file-saver"
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as showdown from 'showdown';
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
  questionTypes: string[] = [''];

  @ViewChild('dataToExport', { static: false })
  public dataToExport!: ElementRef;

  constructor(private fb: FormBuilder, private aiService: AiService, private markdownService: MarkdownService, private stateService: StateService) {
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
    this.aiService.generateTest(formData).subscribe(async response => {
      this.testString = response.test;
      this.test = await this.markdownService.convert(response.test);
      this.stateService.setTestData(this.test);
      this.loading = false;
    }, error => {
      console.error('Error generating lesson plan', error);
      this.loading = false;
    });
  }

  saveAsPdf() {
    let height = window.screen.availHeight-100;
    let width = window.screen.availWidth-150;
    var printWindow = window.open('', '', `height=${height},width=${width}`);
    if (printWindow != null){
      printWindow.document.write('<html><head><title></title>');
      // Place css file in assets folder
      // printWindow.document.write('<link rel="stylesheet" href="assets/css/printPDF.css" />');
      printWindow.document.write('</head><body>');
      printWindow.document.write(this.testString);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
  //   // Wait for the content to be fully loaded before printing
  //   printWindow.onload = () => {
  //     printWindow.print();
  //     printWindow.close(); // Optionally close the print window after printing
  //   };
  // }
    }
    return;
    }

    saveAsTextFile() {
      const blob = new Blob([this.testString], { type: 'text/plain' });
      saveAs(blob, 'generated_test.txt');
    }
  
    copyToClipboard() {
      navigator.clipboard.writeText(this.testString).then(() => {
        alert('Test copied to clipboard');
      }).catch(err => {
        console.error('Could not copy text: ', err);
      });
    }
  }
