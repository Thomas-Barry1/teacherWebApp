import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gap-assessment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gap-assessment.component.html',
  styleUrl: './gap-assessment.component.css'
})
export class GapAssessmentComponent implements OnInit {
  targetDate = new Date('2025-04-07T00:00:00'); // Set the launch date
  timeLeft: string = '';

  ngOnInit() {
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 1000); // Update countdown every second
  }

  updateCountdown() {
    const now = new Date().getTime();
    const distance = this.targetDate.getTime() - now;

    if (distance < 0) {
      this.timeLeft = "We're live!";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.timeLeft = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
}
