import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  generateLessonPlan(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-lesson-plan`, data);
  }

  generateQuiz(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-quiz`, data);
  }

  getLessonPlan(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/lesson-plan/${id}`);
  }

  getQuiz(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/quiz/${id}`);
  }
}
