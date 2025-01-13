// src/app/components/about/about.component.ts
import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';

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
export class AboutComponent{
  constructor(private route: ActivatedRoute, private authService: AuthService) {
    if (!this.authService.getUserInfo()){
      this.authService.init();
    }
  }

  ngOnInit() {
    this.route.url.subscribe(([url]) => {
      const { path, parameters } = url;
      console.log("About path: ", path); // e.g. /products
      console.log(parameters); // e.g. { id: 'x8klP0' }
      this.authService.returnUrl = path;
    });
  }
}
