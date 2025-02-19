import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class CpfcGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    let url: string = state.url;
    return this.checkLogin(url);
  }
  checkLogin(url: string): true | UrlTree {
    let val: string = localStorage.getItem('usuarioLogado') || '';
    if (val != null && val == 'true') {
      if (url == '/login') return this.router.parseUrl('/dashboard');
      else return true;
    } else {
      return this.router.parseUrl('/login');
    }
  }
}
