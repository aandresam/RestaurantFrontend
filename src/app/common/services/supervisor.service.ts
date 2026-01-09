import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Supervisor } from '../models/supervisor.model';

@Injectable({
  providedIn: 'root',
})
export class SupervisorService {
  private apiUrl = `${environment.apiUrl}/supervisores`;
  private http = inject(HttpClient);

  public getSupervisores(): Observable<Supervisor[]> {
    return this.http.get<Supervisor[]>(`${this.apiUrl}`);
  }
}
