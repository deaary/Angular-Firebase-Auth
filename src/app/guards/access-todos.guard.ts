import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AccessTodosGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.currentUser.pipe(
      map((user) => {
        // se user for igual nulo, nao ha nenhum usuario logado e a pessoa sera redirecionada para a pagina de login
        if (user == null) {
          this.router.parseUrl('/auth/login')
        }
        // Se a pessoa esta logada, mas ainda nao verificou o email dela, ela sera redirecionada para a pagina informando que ela precisa verificar o email dela
        if (!user?.emailVerified) {
          user?.sendEmailVerification()
          return this.router.parseUrl('/auth/verify-email')
        }
        return true
      })
    )
  }
  
}
