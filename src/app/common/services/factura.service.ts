import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Factura } from '../models/factura.model';
import { CrearFacturaResponseModel } from '../models/crear-factura-response.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FacturaService {
  private apiUrl = `${environment.apiUrl}/facturas`;
  private http = inject(HttpClient);

  public createFactura(facturaData: Factura): Observable<CrearFacturaResponseModel> {
    return this.http.post<CrearFacturaResponseModel>(`${this.apiUrl}`, { ...facturaData });
  }
}
