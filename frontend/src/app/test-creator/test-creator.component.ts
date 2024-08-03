import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../ai.service';
import { MarkdownService } from '../markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { saveAs } from "file-saver"
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-test-creator',
  // standalone: true,
  // imports: [],
  templateUrl: './test-creator.component.html',
  styleUrl: './test-creator.component.css'
})
export class TestCreatorComponent {
  testForm: FormGroup;
  test: SafeHtml = '';
  testString = ''
  loading: boolean = false;

  constructor(private fb: FormBuilder, private aiService: AiService, private markdownService: MarkdownService) {
    this.testForm = this.fb.group({
      topic: ['']
    });
  }

  generateTest(): void {
    this.loading = true;
    const topic = this.testForm.value.topic;
    this.aiService.generateTest(topic).subscribe(async response => {
      this.testString = response.test
      this.test = await this.markdownService.convert(response.test);
      this.loading = false;
    }, error => {
      console.error('Error generating lesson plan', error);
      this.loading = false;
    });
  }

  saveAsPdf() {
    const element = document.getElementById('test-content');
    if (element) {
      html2canvas(element).then(canvas => {
        // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
 
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight)
        pdf.save('generated_test.pdf');
      });
    }
    // const blob = new Blob([this.testString], { type: 'application/pdf' });
    // saveAs(blob, 'generated_test.pdf');
  }

  // saveAsTextFile() {
  //   const blob = new Blob([this.safeHtmlToString(this.test)], { type: 'text/plain' });
  //   saveAs(blob, 'generated_test.txt');
  // }

  // copyToClipboard() {
  //   navigator.clipboard.writeText(this.safeHtmlToString(this.test)).then(() => {
  //     alert('Test copied to clipboard');
  //   }).catch(err => {
  //     console.error('Could not copy text: ', err);
  //   });
  // }

  private safeHtmlToString(safeHtml: SafeHtml): string {
    return safeHtml.toString().replace(/^SafeHtml/, '');
  }
}
