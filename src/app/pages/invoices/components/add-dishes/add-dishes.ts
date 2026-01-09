import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Mesa } from '../../../../common/models/mesa.model';
import { Plato } from '../../../../common/models/plato.model';
import { FacturaLocalService } from '../../../../common/services/factura-local.service';

@Component({
  selector: 'app-add-dishes',
  imports: [
    NzCardModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzTooltipModule,
    NzTableModule,
    CurrencyPipe,
    NzPopconfirmModule,
    FormsModule,
  ],
  templateUrl: './add-dishes.html',
  styleUrl: './add-dishes.scss',
})
export class AddDishes {
  private invoiceService = inject(FacturaLocalService);

  public platos = input.required<Plato[]>();
  public mesas = input.required<Mesa[]>();

  public mesaSeleccionada: number | null = this.invoiceService.mesaSeleccionada()
    ? this.invoiceService.mesaSeleccionada()!.id
    : null;
  public platoSeleccionado: number | null = null;
  public platosSeleccionados = this.invoiceService.platosSeleccionados;

  public opcionesDePlatos = computed(() =>
    this.platos().map((item) => ({ label: item.plato, value: item.id }))
  );
  public opcionesDeMesas = computed(() =>
    this.mesas().map((item) => ({ label: item.nombre, value: item.id }))
  );

  constructor() {}

  public agregarPlato(platoId: number): void {
    const plato = this.platos().find((p) => p.id === platoId);
    if (plato) {
      this.invoiceService.agregarPlato(plato);
    }
  }

  public seleccionarMesa(mesaId: number): void {
    const mesa = this.mesas().find((m) => m.id === mesaId) || null;
    this.invoiceService.seleccionarMesa(mesa);
  }

  public restarCantidad(platoId: number): void {
    this.invoiceService.restarCantidadPlato(platoId);
  }

  public confirm(idPlato: number): void {
    this.invoiceService.eliminarPlato(idPlato);
  }
}
