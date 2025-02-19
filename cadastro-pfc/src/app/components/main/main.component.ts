import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  usuarioLogin = localStorage.getItem('usuarioLogin');
  usuarioNome = localStorage.getItem('usuarioNome');
  title:any = '';
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );
  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    router.events.forEach(e => {
      if (e instanceof NavigationEnd) {
        this.title = route.root!.firstChild?.firstChild?.snapshot.title;
        this.usuarioNome = localStorage.getItem('usuarioNome');
      }
    });
  }

  onClickLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
