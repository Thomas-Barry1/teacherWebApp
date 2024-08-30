// src/app/components/activities/activities.component.ts
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AiService } from '../services/ai.service';
import { MarkdownService } from '../services/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { StateService } from '../services/state.service';

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
  activitiesString: string = '';

  @ViewChild('dataToExport', { static: false })
  public dataToExport!: ElementRef;

  constructor(private fb: FormBuilder, private apiService: AiService, 
    private markdownService: MarkdownService,
    private stateService: StateService) {
    this.activitiesForm = this.fb.group({
      topic: [''],
      gradeLevel: [''],
      commonCoreStandards: [''],
      skills: [''],
      state: ['']
    });
    // Load existing data if available
    this.activities = this.stateService.getActivityData();
  }

  generateActivities() {
    this.loading = true;
    // const concept = this.activitiesForm.get('concept')?.value;
    const topic = this.activitiesForm.value;
    console.log(topic)
    this.apiService.generateActivities(topic).subscribe(async response => {
      this.activitiesString = await this.markdownService.convertHtml(response.activities);
      this.activities = await this.markdownService.convert(response.activities);
      this.stateService.setActivityData(this.activities);
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
