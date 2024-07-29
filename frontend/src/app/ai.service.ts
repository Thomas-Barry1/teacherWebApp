import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// Implement caching and efficient state management to reduce redundant API calls.

// Implementation:

//     Use RxJS to Cache API Responses:

export class AiService {
  // private apiUrl = 'https://teach.webexpansions.com/api';
  private apiUrl = 'https://127.0.0.1/api';

  constructor(private http: HttpClient) { }

  generateLessonPlan(topic: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/lesson-plan`, { topic });
  }

  generateTest(concept: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/test`, { concept });
  }

  generateActivities(concept: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/activities`, { concept });
  }
}


