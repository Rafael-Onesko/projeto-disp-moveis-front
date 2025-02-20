import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private baseApiUrl = 'https://localhost:7258/api/Usuarios';

  constructor(private _http: HttpClient) {}

  getAllUsuarios() {
    return this._http.get<Usuario[]>(`${this.baseApiUrl}`);
  }
  getOneUsuario(login: string): Observable<Usuario> {
    return this._http.get<Usuario>(`${this.baseApiUrl}/${login}`);
  }

  addUsuario(usuario: Usuario): Observable<boolean> {
    return this._http.post<boolean>(this.baseApiUrl, usuario);
  }
  
  editUsuario(usuario: Usuario, login: string): Observable<boolean> {
    const params = new HttpParams().append('email', login)
    return this._http.post<boolean>(`${this.baseApiUrl}`, usuario, { params });
  }

  delete(login: string) {
    return this._http.delete(`${this.baseApiUrl}/${login}`)
  }
}
