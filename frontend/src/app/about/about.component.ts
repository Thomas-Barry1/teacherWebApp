import { Component } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-about',
  // standalone: true,
  // imports: [],
  // animations: [
  //   trigger('fadeIn', [
  //     transition(':enter', [
  //       style({ opacity: 0 }),
  //       animate('1s', style({ opacity: 1 }))
  //     ])
  //   ]),
  //   trigger('fadeInDown', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateY(-20px)' }),
  //       animate('1s', style({ opacity: 1, transform: 'translateY(0)' }))
  //     ])
  //   ]),
  //   trigger('fadeInUp', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateY(20px)' }),
  //       animate('1s', style({ opacity: 1, transform: 'translateY(0)' }))
  //     ])
  //   ])
  // ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  testimonials = [
    { name: 'John Doe', position: 'High School Teacher', message: 'TeachGenie has revolutionized the way I create lesson plans and tests. It saves me hours every week!' },
    { name: 'Jane Smith', position: 'Middle School Teacher', message: 'The AI assistance is a game-changer. I can get help anytime I need it.' }
  ];
}
