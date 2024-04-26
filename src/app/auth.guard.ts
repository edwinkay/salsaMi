import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthServiceService } from './services/auth-service.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthServiceService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Comprueba si el usuario ha iniciado sesión
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn) => {
        if (isLoggedIn) {
          // Si el usuario ha iniciado sesión, permitir el acceso
          return true;
        } else {
          // Si el usuario no ha iniciado sesión, redirigir al usuario a la página de inicio de sesión
          this.router.navigate(['/login']);
          return false;
        }
      })
    );
  }
}
