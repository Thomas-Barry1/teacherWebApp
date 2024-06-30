import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../ai.service';

@Component({
  selector: 'app-test-creator',
  // standalone: true,
  // imports: [],
  templateUrl: './test-creator.component.html',
  styleUrl: './test-creator.component.css'
})
export class TestCreatorComponent {
  testForm: FormGroup;
  test: string = '';

  constructor(private fb: FormBuilder, private chatGptService: AiService) {
    this.testForm = this.fb.group({
      topic: ['']
    });
  }

  generateTest(): void {
    const topic = this.testForm.value.topic;
    this.chatGptService.generateTest(topic).subscribe(response => {
      this.test = response.choices[0].text;
    });
  }
}
