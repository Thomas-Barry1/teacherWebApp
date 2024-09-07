// src/app/components/about/about.component.ts
import { Component } from '@angular/core';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in-out', style({ opacity: 1 }))
      ])
    ]),
    trigger('fadeInDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('1s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('1s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggeredFadeIn', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger('200ms', [
            animate('1s ease-in-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class AboutComponent {
  testimonials = [
    { name: 'Michael', position: '6th grade math teacher', message: "I've found Teachgenie to be an invaluable tool in my classroom. Its ease of use and intuitive design make it simple to integrate into my lesson plans. Whether I need supplemental resources, tests, or an engaging activity Teachgenie delivers on almost any topic with just a few clicks. I highly recommend it to any educator looking to enhance their teaching resources effortlessly." },
    { name: 'Jack Smith', position: 'High School Teacher', message: 'TeachGenie has revolutionized the way I create lesson plans and tests. It saves me hours every week!' },
    { name: 'Donald P', position: 'Middle School Teacher', message: 'The AI assistance is a game-changer. I can get help anytime I need it.' },
  ];
}
