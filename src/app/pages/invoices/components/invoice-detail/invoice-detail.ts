import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FacturaLocalService } from '../../../../common/services/factura-local.service';
import { FacturaService } from '../../../../common/services/factura.service';
import { CrearFacturaResponseModel } from '../../../../common/models/crear-factura-response.model';

@Component({
  selector: 'app-invoice-detail',
  imports: [NzCardModule, NzButtonModule, NzDividerModule, CurrencyPipe],
  templateUrl: './invoice-detail.html',
  styleUrl: './invoice-detail.scss',
})
export class InvoiceDetail {
  private facturaLocalService = inject(FacturaLocalService);
  private facturaService = inject(FacturaService);
  private messageService = inject(NzMessageService);

  public platosSeleccionados = this.facturaLocalService.platosSeleccionados;
  public facturaEsValida = this.facturaLocalService.facturaEsValida;

  public clienteSeleccionado = this.facturaLocalService.clienteSeleccionado;
  public meseroSeleccionado = this.facturaLocalService.meseroSeleccionado;
  public supervisorSeleccionado = this.facturaLocalService.supervisorSeleccionado;
  public mesaSeleccionada = this.facturaLocalService.mesaSeleccionada;

  public registrarFactura(): void {
    const mensajeId = this.messageService.loading('Registrando factura...').messageId;
    const factura = this.facturaLocalService.generarFactura();
    if (factura) {
      this.facturaService.createFactura(factura).subscribe({
        next: (response: CrearFacturaResponseModel) => {
          this.facturaLocalService.limpiarFactura();
          this.messageService.remove(mensajeId);
          this.messageService.success(`Factura # ${response.nroFactura} registrada exitosamente`, { nzDuration: 3000 });
        },
        error: (response: HttpErrorResponse) => {
          this.messageService.remove(mensajeId);
          this.messageService.error('Error al registrar la factura: ' + response.error.message, { nzDuration: 3000 });
        },
      });
    }
  }

  mensajeCargando(mensaje: string): string {
    return this.messageService.loading(mensaje, { nzDuration: 2000 }).messageId;
  }
}
