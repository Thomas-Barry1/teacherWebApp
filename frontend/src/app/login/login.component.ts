import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider, SocialUser, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
// Google auth
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

//Auth service
import { AuthService } from '../services/auth.service';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{
  // Code pulled from here: https://medium.com/@kushalghosh9899/authenticate-with-google-in-angular-17-via-oauth2-196a98793f0c
  user: SocialUser | undefined;
  loggedIn: boolean | undefined;

  //URL of route that called this login component
  returnUrl: string = '';

  constructor(private socialAuthService: SocialAuthService, 
    private router: Router, 
    private authService: AuthService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Update returnUrl whenever the route changes
    this.route.queryParams.subscribe(params => {
      // Get the return URL from query parameters (or set a default)
      this.returnUrl = params['returnUrl'] || '/';
      // console.log("Return URL: ", this.returnUrl);
      this.authService.returnUrl = this.returnUrl;
    });
    this.authService.init(this.returnUrl);
  }

  signInWithGoogle(): void {
    console.log("SignInWithGoogle Method");
    this.authService.signInWithGoogle();
  }

  signOut(): void {
    console.log("SignOut Method");
    this.authService.signOut();
  }
}
