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
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  generateLessonPlan(topic: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/lesson-plan`, { topic });
  }

  generateTest(concept: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/test`, { concept });
  }
}

// private apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions'; // Example endpoint, update as needed
//   private apiKey = 'YOUR_API_KEY_HERE';

//   constructor(private http: HttpClient) {}

//   generateLessonPlan(topic: string): Observable<any> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${this.apiKey}`
//     });

//     const body = {
//       prompt: `Create a lesson plan for the topic: ${topic}`,
//       max_tokens: 500
//     };

//     return this.http.post(this.apiUrl, body, { headers });
//   }

//   generateTest(topic: string): Observable<any> {
//     const headers = new HttpHeaders({
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${this.apiKey}`
//     });

//     const body = {
//       prompt: `Create a test on the topic: ${topic}`,
//       max_tokens: 500
//     };

//     return this.http.post(this.apiUrl, body, { headers });
//   }
// }


