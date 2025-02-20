import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Materia } from '../interfaces/materia';


@Injectable({
  providedIn: 'root',
})
export class MateriaService {
  private baseApiUrl = 'https://localhost:7258/api/Materias';

  constructor(private _http: HttpClient) {}

  getAllMaterias() {
    return this._http.get<Materia[]>(`${this.baseApiUrl}`);
  }
  getOneMateria(id: string): Observable<Materia> {
    return this._http.get<Materia>(`${this.baseApiUrl}/${id}`);
  }

  addMateria(usuario: Materia): Observable<boolean> {
    return this._http.post<boolean>(this.baseApiUrl, usuario);
  }
  
  editMateria(usuario: Materia, id: string): Observable<boolean> {
    const params = new HttpParams().append('id', id)
    return this._http.post<boolean>(`${this.baseApiUrl}`, usuario, { params });
  }

  delete(id: string) {
    return this._http.delete(`${this.baseApiUrl}/${id}`)
  }
}
