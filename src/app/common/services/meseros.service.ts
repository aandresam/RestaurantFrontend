import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Mesero } from '../models/mesero.model';

@Injectable({
  providedIn: 'root',
})
export class MeseroService {
  private apiUrl = `${environment.apiUrl}/meseros`;
  private http = inject(HttpClient);

  public getMeseros(): Observable<Mesero[]> {
    return this.http.get<Mesero[]>(`${this.apiUrl}`);
  }
}
