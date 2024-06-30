import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = 'https://api.openai.com/v1/engines/davinci-codex/completions'; // Example endpoint, update as needed
  private apiKey = 'YOUR_API_KEY_HERE';

  constructor(private http: HttpClient) {}

  generateLessonPlan(topic: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      prompt: `Create a lesson plan for the topic: ${topic}`,
      max_tokens: 500
    };

    return this.http.post(this.apiUrl, body, { headers });
  }

  generateTest(topic: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      prompt: `Create a test on the topic: ${topic}`,
      max_tokens: 500
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
