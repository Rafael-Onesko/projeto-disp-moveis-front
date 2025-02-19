import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Colaborador, Colaboradores } from '../interfaces/colaborador';
@Injectable({
  providedIn: 'root'
})
export class ColaboradoresService {
  private baseApiUrl = 'https://localhost:7258/api/Colaboradores';
  constructor(private _http: HttpClient) {}

  getAllColaboradores() {
    return this._http.get<Colaboradores[]>(`${this.baseApiUrl}`);
  }
  getOneColaborador(id: number): Observable<Colaborador> {
    return this._http.get<Colaborador>(`${this.baseApiUrl}/${id}`);
  }
  getMatricula(matricula: number): Observable<boolean>{
    return this._http.get<boolean>(`${this.baseApiUrl}/matricula/${matricula}`);
  }

  addColaborador(colaborador: Colaborador): Observable<Colaborador> {
    return this._http.post<Colaborador>(this.baseApiUrl, colaborador);
  }

  editColaborador(colaborador: Colaborador, id: number): Observable<Colaborador> {
    const params = new HttpParams().append('id', id)
    return this._http.post<Colaborador>(`${this.baseApiUrl}`, colaborador, { params });
  }

  getCEP(cep: string){
    return this._http.get<any>(`https://viacep.com.br/ws/${cep}/json/`);
  }

  delete(id: number) {
    return this._http.delete(`${this.baseApiUrl}/${id}`)
  }

}


  

