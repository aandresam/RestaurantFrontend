import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { ClienteConsumoMinimo } from '../../common/models/cliente-consumo-minimo.model';
import { MeseroVenta } from '../../common/models/mesero-venta.model';
import { ReporteService } from '../../common/services/report.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ProductoMasVendido } from '../../common/models/producto-mas-vendido';

@Component({
  selector: 'app-queries',
  imports: [
    NzCardModule,
    NzTableModule,
    CurrencyPipe,
    NzDatePickerModule,
    FormsModule,
    NzTooltipModule,
    NzTabsModule,
    NzInputNumberModule,
  ],
  templateUrl: './queries.html',
  styleUrl: './queries.scss',
})
export class QueriesComponent implements OnInit {
  private reporteService = inject(ReporteService);
  private messageService = inject(NzMessageService);

  index = 0;
  tabs = ['Ventas por mesero', 'Clientes destacados', 'Plato más vendido'];

  public loadingMeseroVentaTable = true;
  public ventasPorMesero: MeseroVenta[] = [];
  public rangoFechas: Date[] = [
    new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59),
  ];

  public loadingClientesDestacadosTable = true;
  public consumoDeClientes: ClienteConsumoMinimo[] = [];
  public consumoMinimo: number = 0;
  formatterDollar = (value: number): string => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  parserDollar = (value: string): number => +value?.replace(/\$\s?|(,*)/g, '');

  public productoMasVendidoDelMes: ProductoMasVendido | null = null;

  ngOnInit() {
    const fechaInicio = this.rangoFechas[0].toISOString();
    const fechaFin = this.rangoFechas[1].toISOString();
    this.cargarVentasPorMesero(
      fechaInicio,
      fechaFin
    );
    this.cargarConsumoDeClientes(
      fechaInicio,
      fechaFin,
      this.consumoMinimo
    );
    this.cargarProductoMasVendidoDelMes(
      this.rangoFechas[0].getFullYear(),
      this.rangoFechas[0].getMonth()
    );
  }

  public cargarVentasPorMesero(fechaInicio: string, fechaFin: string): void {
    this.reporteService.GetVentasPorMesero(fechaInicio, fechaFin).subscribe({
      next: (ventas) => {
        this.ventasPorMesero = ventas;
        this.loadingMeseroVentaTable = false;
      },
      error: (error) => {
        this.messageService.error('No se pudieron cargar las ventas por mesero.');
        console.error('Error al cargar las ventas por mesero:', error);
      },
    });
  }

  public cargarConsumoDeClientes(fechaInicio: string, fechaFin: string, consumoMinimo: number): void {
    if (!this.rangoFechas || this.rangoFechas.length < 2) {
      return; 
    }
    this.loadingClientesDestacadosTable = true;
    this.reporteService
      .GetClientesConConsumoMinimo(
        fechaInicio,
        fechaFin,
        consumoMinimo
      )
      .subscribe({
        next: (clientes) => {
          this.consumoDeClientes = clientes;
          this.loadingClientesDestacadosTable = false;
        },
        error: (error) => {
          this.messageService.error('No se pudieron cargar los clientes.');
          console.error('Error al cargar los clientes con consumo mínimo:', error);
        },
      });
  }

  public cargarProductoMasVendidoDelMes(anio: number, mes: number): void {
    this.reporteService.GetProductoMasVendidoDelMes(anio, mes).subscribe({
      next: (producto) => {
        this.productoMasVendidoDelMes = producto;
      },
      error: (error) => {
        this.messageService.error('No se pudo cargar el producto más vendido del mes.');
        console.error('Error al cargar el producto más vendido del mes:', error);
      },
    });
  }

  public onChangeVentasPorMesero(result: Date[]): void {
    if (result.length === 0) {
      return;
    }
    this.loadingMeseroVentaTable = true;
    this.cargarVentasPorMesero(result[0].toISOString(), result[1].toISOString());
  }

  public onChangeConsumoDeClientes(consumo: number): void {
    if (this.rangoFechas.length < 2) {
      this.messageService.error('Por favor, seleccione un rango de fechas válido antes de filtrar por consumo mínimo.');
      return;
    }
    this.loadingClientesDestacadosTable = true;
    this.cargarConsumoDeClientes(
      this.rangoFechas[0].toISOString(),
      this.rangoFechas[1].toISOString(),
      consumo
    );
  }

  public onChangeProductoMasVendido(result: Date[]): void {
    if (result.length === 0) {
      return;
    }
    this.productoMasVendidoDelMes = null;
    this.cargarProductoMasVendidoDelMes(result[0].getFullYear(), result[0].getMonth());
  }
}
