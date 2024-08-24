import { Injectable } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
// This service stores the state of values when switching between pages
export class StateService {
  private testData: SafeHtml = '';
  private activityData: SafeHtml = '';
  private lessonPlanData: SafeHtml = '';

  setTestData(data: SafeHtml) {
    this.testData = data;
  }

  getTestData(): SafeHtml {
    return this.testData;
  }

  setActivityData(data: SafeHtml) {
    this.activityData = data;
  }

  getActivityData(): SafeHtml {
    return this.activityData;
  }

  setLessonPlanData(data: SafeHtml) {
    this.lessonPlanData = data;
  }

  getLessonPlanData(): SafeHtml {
    return this.lessonPlanData;
  }
}
