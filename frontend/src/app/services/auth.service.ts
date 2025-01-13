import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Code pulled from here: https://medium.com/@kushalghosh9899/authenticate-with-google-in-angular-17-via-oauth2-196a98793f0c
  user: SocialUser | undefined;
  // BehaviorSubject to track the current user
  private userSubject = new BehaviorSubject<SocialUser | undefined>(undefined);
  public user$ = this.userSubject.asObservable();
  loggedIn: boolean = false;

  //URL of route that called this login component
  returnUrl: string = '';

  constructor(private socialAuthService: SocialAuthService, 
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private apiService: ApiService) {}

  init(): void {
    // Get the return URL from query parameters (or set a default)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.socialAuthService.authState.subscribe((user) => {
      // localStorage.setItem('authToken', user.authToken); // Store the JWT to use for secure authentication
      this.user = user;
      this.loggedIn = (user != null);
      // Update userSubject and user$ observable
      this.userSubject.next(user);
      // Send user info to backend
      this.apiService.sendAuthInfoToBackend(user).subscribe(async response => {
        console.log("AuthBackendResponse: ", response);
      }, error => {
        console.error('Error sending data to backend.', error);
      });
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

  // Method to clear the user information upon logout
  logout() {
    this.userSubject.next(undefined);
  }

  isLoggedIn(): boolean {
    return this.loggedIn;
  }

  // Method to get the current user information
  getUserInfo(): SocialUser | undefined {
    return this.userSubject.value;
  }
}
