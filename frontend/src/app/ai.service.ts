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
  private apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions'; // Example endpoint, update as needed
  private apiKey = ''; 
  private cache = new Map<string, Observable<any>>();

  constructor(private http: HttpClient) {}

  generateLessonPlan(topic: string): Observable<any> {
    const cacheKey = `lessonPlan-${topic}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!; // Return cached response if available
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      prompt: `Create a lesson plan for the topic: ${topic}`,
      max_tokens: 500
    };

    const response$ = this.http.post(this.apiUrl, body, { headers }).pipe(
      shareReplay(1) // Cache the response
    );
    this.cache.set(cacheKey, response$);
    return response$;
  }

  generateTest(topic: string): Observable<any> {
    const cacheKey = `test-${topic}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!; // Return cached response if available
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      prompt: `Create a test on the topic: ${topic}`,
      max_tokens: 500
    };

    const response$ = this.http.post(this.apiUrl, body, { headers }).pipe(
      shareReplay(1) // Cache the response
    );
    this.cache.set(cacheKey, response$);
    return response$;
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


