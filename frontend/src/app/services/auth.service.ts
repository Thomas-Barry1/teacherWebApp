import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Code pulled from here: https://medium.com/@kushalghosh9899/authenticate-with-google-in-angular-17-via-oauth2-196a98793f0c
  user: SocialUser | undefined;
  loggedIn: boolean = false;

  //URL of route that called this login component
  returnUrl: string = '';

  constructor(private socialAuthService: SocialAuthService, 
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private apiService: ApiService) {}

  init(returnUrl:string): void {
    // Get the return URL from query parameters (or set a default)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.socialAuthService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
      // Send user info to backend
      this.apiService.sendAuthInfoToBackend(user);
      // Redirect the user to the return URL after successful login
      this.router.navigate([this.returnUrl]);
    });
  }

  signInWithGoogle(): void {
    console.log("SignInWithGoogle Method Auth");
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    console.log("SignOut Method Auth");
    this.socialAuthService.signOut();
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Retrieve saved user info
  getAuthInfo() {
    return this.user;
  }
}
