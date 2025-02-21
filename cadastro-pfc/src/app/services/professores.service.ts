import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Professor } from '../interfaces/professor';


@Injectable({
  providedIn: 'root',
})
export class ProfessorService {
  private baseApiUrl = 'https://localhost:7258/api/Professores';

  constructor(private _http: HttpClient) {}

  getAllProfessores() {
    return this._http.get<Professor[]>(`${this.baseApiUrl}`);
  }
  getOneProfessor(login: string): Observable<Professor> {
    return this._http.get<Professor>(`${this.baseApiUrl}/${login}`);
  }

  addProfessor(professor: Professor): Observable<boolean> {
    return this._http.post<boolean>(this.baseApiUrl, professor);
  }
  
  editProfessor(professor: Professor, login: string): Observable<boolean> {
    const params = new HttpParams().append('email', login)
    return this._http.post<boolean>(`${this.baseApiUrl}`, professor, { params });
  }

  delete(login: string) {
    return this._http.delete(`${this.baseApiUrl}/${login}`)
  }
}
