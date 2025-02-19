import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthData } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseApiUrl = 'https://localhost:7258/api/Usuarios';

  constructor(private _http: HttpClient) { }
  usuarioLogado = false;
  usuarioIsAdmin = false;
  getLogin(auth: AuthData): Observable<boolean> {
    return this._http.post<boolean>(`${this.baseApiUrl}/Auth`, auth);
  }

  checkAuth(auth: boolean, admin: boolean, login: string, nome: string) {
    localStorage.setItem('usuarioLogado', auth ? 'true' : 'false');
    localStorage.setItem('usuarioAdmin', admin ? 'true' : 'false');
    localStorage.setItem('usuarioLogin', login);
    const usuarioNome = nome.substring(0, nome.indexOf(' '));
    if (usuarioNome == '') { localStorage.setItem('usuarioNome', nome); }
    else { localStorage.setItem('usuarioNome', usuarioNome); }
  }

  logout(): void {
    this.usuarioLogado = false;
    localStorage.removeItem('usuarioLogado');
    localStorage.removeItem('usuarioAdmin');
    localStorage.removeItem('usuarioLogin');
    localStorage.removeItem('usuarioNome');
  }
}
