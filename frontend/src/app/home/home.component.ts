import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SocialUser } from '@abacritt/angularx-social-login';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  // standalone: true,
  // imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  user: SocialUser | undefined;  // SocialUser is either an object or undefined

  constructor( private authService: AuthService, private route: ActivatedRoute) {
    // Subscribe to the user observable from AuthService
    this.authService.user$.subscribe(user => {
      // Get user info
      console.log("Inside home component ngOninit subscribe");
      this.user = user;  // Update the user information when it changes
    });

    // Initialize with the current user info if already logged in
    console.log("Default in ngOnit");
    this.user = this.authService.getUserInfo();
    // Initialize auth service
    this.route.url.subscribe((event) => {
      console.log(event[0]); // It's an array remember [0]
      console.log(event[0].path); // e.g. /products
      // this.authService.init();
      console.log(event[0].parameters); // e.g. { id: 'x8klP0' }
    });
  }

  isMenuOpen: boolean = true;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
  }
}
