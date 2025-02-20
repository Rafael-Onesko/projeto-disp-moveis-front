import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role';


@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseApiUrl = 'https://localhost:7258/api/Roles';

  constructor(private _http: HttpClient) {}

  getAllRoles() {
    return this._http.get<Role[]>(`${this.baseApiUrl}`);
  }
  getOneRole(id: string): Observable<Role> {
    return this._http.get<Role>(`${this.baseApiUrl}/${id}`);
  }

  addRole(role: Role): Observable<boolean> {
    return this._http.post<boolean>(this.baseApiUrl, role);
  }
  
  editRole(role: Role, id: string): Observable<boolean> {
    const params = new HttpParams().append('id', id)
    return this._http.post<boolean>(`${this.baseApiUrl}`, role, { params });
  }

  delete(id: string) {
    return this._http.delete(`${this.baseApiUrl}/${id}`)
  }
}
