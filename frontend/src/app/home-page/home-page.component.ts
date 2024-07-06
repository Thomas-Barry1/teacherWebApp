import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  // standalone: true,
  // imports: [],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  features = [
    { icon: 'school', title: 'Easy Lesson Planning', description: 'Generate comprehensive lesson plans effortlessly.' },
    { icon: 'assignment', title: 'Automated Test Creation', description: 'Create tests and quizzes in seconds.' },
    { icon: 'help_outline', title: '24/7 AI Assistance', description: 'Get instant help and support anytime, anywhere.' }
  ];
}
