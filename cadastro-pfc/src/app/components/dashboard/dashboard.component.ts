import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  usuarioLogin = localStorage.getItem('usuarioLogin');
  usuarioNome = localStorage.getItem('usuarioNome');
  
  constructor(private breakpointObserver: BreakpointObserver) {}
}
