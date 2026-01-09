import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { ClienteConsumoMinimo } from '../models/cliente-consumo-minimo.model';
import { MeseroVenta } from '../models/mesero-venta.model';
import { ProductoMasVendido } from '../models/producto-mas-vendido';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private apiUrl = `${environment.apiUrl}/reportes`;
  private http = inject(HttpClient);

  public GetVentasPorMesero(fechaInicio: string, fechaFin: string): Observable<MeseroVenta[]> {
    return this.http.get<MeseroVenta[]>(
      `${this.apiUrl}/ventas-por-mesero?startDate=${fechaInicio}&endDate=${fechaFin}`
    );
  }

  public GetClientesConConsumoMinimo(
    fechaInicio: string,
    fechaFin: string,
    consumoMinimo: number
  ): Observable<ClienteConsumoMinimo[]> {
    return this.http.get<ClienteConsumoMinimo[]>(
      `${this.apiUrl}/clientes-consumo-minimo?startDate=${fechaInicio}&endDate=${fechaFin}&minimumSpend=${consumoMinimo}`
    );
  }

  public GetProductoMasVendidoDelMes(
    anio: number,
    mes: number
  ): Observable<ProductoMasVendido> {
    mes = mes + 1;
    return this.http.get<ProductoMasVendido>(
      `${this.apiUrl}/producto-mas-vendido?year=${anio}&month=${mes}`
    );
  }
}
