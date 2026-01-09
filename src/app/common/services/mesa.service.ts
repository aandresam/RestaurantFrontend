import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Mesa } from '../models/mesa.model';

@Injectable({
  providedIn: 'root',
})
export class MesaService {
  private apiUrl = `${environment.apiUrl}/mesas`;
  private http = inject(HttpClient);

  public getMesas(): Observable<Mesa[]> {
    return this.http.get<Mesa[]>(`${this.apiUrl}`);
  }
}
