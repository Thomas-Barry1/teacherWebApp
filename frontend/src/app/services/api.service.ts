import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// Implement caching and efficient state management to reduce redundant API calls.

// Implementation:

//     Use RxJS to Cache API Responses:

export class ApiService {
  // API Url, switch these around to do local or production environments
  private apiUrl = 'https://teach.webexpansions.com/api';
  // private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  generateLessonPlan(topic: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/lesson-plan`, topic);
  }

  generateTest(topic: any): Observable<any> {
    // console.log("AI formdata: ", topic);
    return this.http.post<any>(`${this.apiUrl}/test`, topic);
  }

  generateActivities(topic: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/activities`, topic);
  }

  // Send auth info to the backend
  sendAuthInfoToBackend(user: any): Observable<any> {
    console.log("Made it to sendAuthInfoToBackend");
    return this.http.post(`${this.apiUrl}/auth/google`, user);
  }
}