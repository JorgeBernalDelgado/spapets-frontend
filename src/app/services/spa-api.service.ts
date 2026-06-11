import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistroSpa } from './../models/registro-spa.model';

@Injectable({
  providedIn: 'root'
})
export class SpaApiService {
  //private apiUrl = 'http://localhost:8080/api/spa';
  // Ahora usamos https y el puerto 8443
  private apiUrl = 'https://18.225.176.93:8443/api/spa';

  constructor(private http: HttpClient) { }

  registrarIngreso(registro: RegistroSpa): Observable<RegistroSpa> {
    return this.http.post<RegistroSpa>(`${this.apiUrl}/registro`, registro);
  }

  obtenerHistorial(celular: string): Observable<RegistroSpa[]> {
    return this.http.get<RegistroSpa[]>(`${this.apiUrl}/historial/${celular}`);
  }

  eliminarHistorialYUsuario(celular: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/propietario/${celular}`);
  }
}
