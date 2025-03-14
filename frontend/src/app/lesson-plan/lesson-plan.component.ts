import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { MarkdownService } from '../services/markdown.service';
import { SafeHtml } from '@angular/platform-browser';
import { StateService } from '../services/state.service';

@Component({
  selector: 'app-lesson-plan',
  // standalone: true,
  // imports: [],
  templateUrl: './lesson-plan.component.html',
  styleUrls: ['./lesson-plan.component.css']
})
export class LessonPlanComponent {
  lessonForm: FormGroup;
  lessonPlan: SafeHtml = '';
  lessonString: string = '';
  loading: boolean = false;
  editLessonPlan : boolean = false;

  @ViewChild('dataToExport', { static: false })
  public dataToExport!: ElementRef;

  constructor(private fb: FormBuilder, 
    private apiService: ApiService, 
    private markdownService: MarkdownService,
    private stateService: StateService) {
    this.lessonForm = this.fb.group({
      topic: [''],
      gradeLevel: [''],
      commonCoreStandards: [''],
      skills: [''],
      state: ['']
    });
    // Load existing data if available
    this.lessonPlan = this.stateService.getLessonPlanData();
  }

  generateLessonPlan(): void {
    this.loading = true;
    const topic = this.lessonForm;
    this.apiService.generateLessonPlan(topic).subscribe(async response => {
      this.lessonString = await this.markdownService.convertHtml(response.lessonPlan);
      this.lessonPlan = await this.markdownService.convert(response.lessonPlan);
      this.stateService.setLessonPlanData(this.lessonPlan);
      this.loading = false;
    }, error => {
      console.error('Error generating lesson plan', error);
      this.loading = false;
    });
  }

  // Method to handle user edits
  async onContentChange(event: Event) {
    this.editLessonPlan = true;
  }

  saveLessonPlan() {
    this.editLessonPlan = false;

    const editedHtml = this.dataToExport.nativeElement.innerHTML
     // TODO: sanitize updated HTML to ensure safety
     this.lessonPlan = editedHtml;
     this.stateService.setLessonPlanData(editedHtml);

     // Convert sanitized HTML to markdown
     this.lessonString = editedHtml.toString();
     console.log("New lesson plan string: ", this.lessonString);
  }
}

