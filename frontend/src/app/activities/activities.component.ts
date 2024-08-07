// src/app/components/activities/activities.component.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../ai.service';
import { MarkdownService } from '../markdown.service';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent {
  activitiesForm: FormGroup;
  activities: SafeHtml = '';
  savedActivities: SafeHtml[] = [];
  loading: boolean = false;

  constructor(private fb: FormBuilder, private apiService: AiService, private markdownService: MarkdownService) {
    this.activitiesForm = this.fb.group({
      concept: ['']
    });
  }

  generateActivities() {
    this.loading = true;
    // const concept = this.activitiesForm.get('concept')?.value;
    const concept = this.activitiesForm.value.concept;
    console.log(concept)
    this.apiService.generateActivities(concept).subscribe(async response => {
      this.activities = await this.markdownService.convert(response.activities);
      this.loading = false;
    }, error => {
      console.error('Error generating activities', error);
      this.loading = false;
    });
  }

  // saveActivities() {
  //   if (this.activities) {
  //     this.savedActivities.push(this.activities);
  //     this.activities = '';
  //   }
  // }
}
