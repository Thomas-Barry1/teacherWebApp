import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Full_Question } from '../shared/full_question.model';
import { SocialUser } from '@abacritt/angularx-social-login';

@Injectable({
  providedIn: 'root'
})

// Implement caching and efficient state management to reduce redundant API calls.

// Implementation:

//     Use RxJS to Cache API Responses:

export class ApiService {
  // API Url, switch these around for local or production environments
  private apiUrl = 'https://teach.webexpansions.com/api';
  // private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private auth: AuthService) { }

  generateLessonPlan(topic: FormGroup): Observable<any> {
    console.log("Made it to api service LessonPlan");
    let user = this.auth.getUserInfo();
    topic.addControl("user", new FormControl(user?.email));
    console.log("Lesson plan topic: ", topic);
    return this.http.post<any>(`${this.apiUrl}/lesson-plan`, topic.value);
  }

  generateTest(topic: FormGroup): Observable<any> {
    console.log("Made it to api service Test");
    let user = this.auth.getUserInfo();
    topic.addControl("user", new FormControl(user?.email));
    console.log("Test topic: ", topic);
    return this.http.post<any>(`${this.apiUrl}/test`, topic.value);
  }

  generateKahoot(topic: FormGroup): Observable<any> {
    console.log("Made it to api service Kahoot");
    let user = this.auth.getUserInfo();
    topic.addControl("user", new FormControl(user?.email));
    console.log("Kahoot topic: ", topic);
    return this.http.post<any>(`${this.apiUrl}/kahoot`, topic.value);
  }

  generateActivities(topic: FormGroup): Observable<any> {
    console.log("Made it to api service Activities");
    let user = this.auth.getUserInfo();
    topic.addControl("user", new FormControl(user?.email));
    console.log("Activities topic: ", topic);
    return this.http.post<any>(`${this.apiUrl}/activities`, topic.value);
  }

  generateGapAssessment(given_full_questions: Full_Question[]) : Observable<any>{
    console.log("Made it to frontend api service generate gap assessment: ", given_full_questions);
    let user = this.auth.getUserInfo();
    let data = {'user': user?.email, 'questions': given_full_questions}
    console.log("Modified response in generate gap assessment: ", data);
    return this.http.post<any>(`${this.apiUrl}/gap-assessment`, data);
  }
  
  generateGapTest(formData: FormGroup): Observable<any> {
    console.log("Made to api service generateGapTest: ", formData);
    let user = this.auth.getUserInfo();
    formData.addControl("user", new FormControl(user?.email));
    console.log("Gap test form: ", formData);
    return this.http.post<any>(`${this.apiUrl}/gap-test`, formData.value);
  }

  generateStandards(formData: FormGroup): Observable<any> { //could define interfaces/models to avoid 'any' typing
    console.log("Made it to frontend api service generate gap standards: ", formData);
    let user = this.auth.getUserInfo();
    formData.addControl("user", new FormControl(user?.email));
    console.log("Generate Standards: ", formData);
    return this.http.post(`${this.apiUrl}/gap-standards`, formData.value);
  }
}