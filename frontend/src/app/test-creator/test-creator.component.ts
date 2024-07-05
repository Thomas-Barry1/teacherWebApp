import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../ai.service';
import { MarkdownService } from '../markdown.service';
import { SafeHtml } from '@angular/platform-browser';

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
      this.test = await this.markdownService.convert(response.test);
      this.loading = false;
    }, error => {
      console.error('Error generating lesson plan', error);
      this.loading = false;
    });
  }
}
