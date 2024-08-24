import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormRequest } from '../formRequest';

@Injectable({
  providedIn: 'root'
})

// Implement caching and efficient state management to reduce redundant API calls.

// Implementation:

//     Use RxJS to Cache API Responses:

export class AiService {
  private apiUrl = 'https://teach.webexpansions.com/api';
  // private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  generateLessonPlan(topic: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lesson-plan`, topic);
  }

  generateTest(topic: any): Observable<any> {
    // console.log("AI formdata: ", topic);
    return this.http.post<any>(`${this.apiUrl}/test`, topic);
  }

  generateActivities(topic: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/activities`, topic);
  }
}