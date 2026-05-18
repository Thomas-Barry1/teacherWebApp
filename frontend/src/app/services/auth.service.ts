import { GoogleLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Code pulled from here: https://medium.com/@kushalghosh9899/authenticate-with-google-in-angular-17-via-oauth2-196a98793f0c
  private readonly bypassOAuthForLocal = true;
  private readonly localUser = {
    email: 'local-dev@teachgenie.local',
    name: 'Local Dev User',
    photoUrl: 'assets/Logo.png'
  } as SocialUser;
  user: SocialUser | undefined = this.bypassOAuthForLocal ? this.localUser : undefined;
  // BehaviorSubject to track the current user
  private userSubject = new BehaviorSubject<SocialUser | undefined>(this.user);
  public user$ = this.userSubject.asObservable();
  loggedIn: boolean = this.bypassOAuthForLocal;

  // API Url, switch these around for local or production environments
  private apiUrl = 'https://teach.webexpansions.com/api';
  // private apiUrl = 'http://localhost:3000/api';

  //URL of route that called this login component
  returnUrl: string = '';

  constructor(private socialAuthService: SocialAuthService, 
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient) {}

  init(): void {
    if (this.bypassOAuthForLocal) {
      this.user = this.localUser;
      this.loggedIn = true;
      this.userSubject.next(this.localUser);
      return;
    }

    // Get the return URL from query parameters (or set a default)
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.socialAuthService.authState.subscribe((user) => {
      // localStorage.setItem('authToken', user.authToken); // Store the JWT to use for secure authentication
      this.user = user;
      this.loggedIn = (user != null);
      // Update userSubject and user$ observable
      this.userSubject.next(user);
      // Send user info to backend
      this.sendAuthInfoToBackend(user).subscribe(async response => {
        console.log("AuthBackendResponse: ", response);
      }, error => {
        console.error('Error sending data to backend.', error);
      });
      // Redirect the user to the return URL after successful login
      this.router.navigate([this.returnUrl]);
    });
  }

  // Send auth info to the backend
  sendAuthInfoToBackend(user: any): Observable<any> {
    console.log("Made it to sendAuthInfoToBackend");
    return this.http.post(`${this.apiUrl}/auth/google`, user);
  }

  signInWithGoogle(): void {
    if (this.bypassOAuthForLocal) {
      this.user = this.localUser;
      this.loggedIn = true;
      this.userSubject.next(this.localUser);
      this.router.navigate([this.returnUrl || '/']);
      return;
    }

    console.log("SignInWithGoogle Method Auth");
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    if (this.bypassOAuthForLocal) {
      return;
    }

    console.log("SignOut Method Auth");
    this.socialAuthService.signOut();
  }

  // Method to clear the user information upon logout
  logout() {
    if (this.bypassOAuthForLocal) {
      return;
    }

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
