import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-home',
  // standalone: true,
  // imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  user: SocialUser | undefined;  // SocialUser is either an object or undefined

  constructor( private authService: AuthService) {}

  isMenuOpen: boolean = true;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  ngOnInit(): void {
    // Subscribe to the user observable from AuthService
    this.authService.user$.subscribe(user => {
      this.user = user;  // Update the user information when it changes
    });

    // Initialize with the current user info if already logged in
    this.user = this.authService.getUserInfo();
  }
}
