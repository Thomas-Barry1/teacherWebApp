import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return true;
    } else {
      // Redirect to login page with the original target route
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}



// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { SocialAuthService } from '@abacritt/angularx-social-login';
// import { Observable } from 'rxjs';
// import { map, take } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {

//   constructor(private authService: SocialAuthService, private router: Router) {}

//   canActivate(): Observable<boolean> {
//     return this.authService.authState.pipe(
//       take(1),
//       map(user => {
//         if (user) {
//           return true;
//         } else {
//           this.router.navigate(['']); // Redirect to the login page
//           return false;
//         }
//       })
//     );
//   }
// }
