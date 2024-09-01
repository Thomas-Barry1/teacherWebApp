import { Component, OnInit } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider, SocialUser, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
// Google auth
import { SocialLoginModule, SocialAuthServiceConfig } from '@abacritt/angularx-social-login';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


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

  constructor(private authService: SocialAuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.authState.subscribe((user) => {
      console.log("NgOnInit Login");
      console.log("User: ", user);
      this.user = user;
      this.loggedIn = (user != null);
      // Redirect to another page
      // this.router.navigate(['/home']);
    });
  }

  signInWithGoogle(): void {
    console.log("SignInWithGoogle Method");
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    console.log("SignOut Method");
    this.authService.signOut();
  }
}
