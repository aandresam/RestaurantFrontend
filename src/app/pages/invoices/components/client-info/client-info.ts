import { Component, computed, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Cliente } from '../../../../common/models/cliente.model';
import { Mesero } from '../../../../common/models/mesero.model';
import { Supervisor } from '../../../../common/models/supervisor.model';
import { FacturaLocalService } from '../../../../common/services/factura-local.service';

@Component({
  selector: 'app-client-info',
  imports: [
    NzCardModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule,
    NzTooltipModule,
    FormsModule,
  ],
  templateUrl: './client-info.html',
  styleUrl: './client-info.scss',
})
export class ClientInfo {
  private invoiceService = inject(FacturaLocalService);

  public clientes = input.required<Cliente[]>();
  public meseros = input.required<Mesero[]>();
  public supervisores = input.required<Supervisor[]>();

  public clienteSeleccionado: number | null = this.invoiceService.clienteSeleccionado()
    ? this.invoiceService.clienteSeleccionado()!.idCliente
    : null;
  public meseroSeleccionado: number | null = this.invoiceService.meseroSeleccionado()
    ? this.invoiceService.meseroSeleccionado()!.idMesero
    : null;
  public supervisorSeleccionado: number | null = this.invoiceService.supervisorSeleccionado()
    ? this.invoiceService.supervisorSeleccionado()!.idSupervisor
    : null;

  public opcionesDeClientes = computed(() =>
    this.clientes().map((item) => ({
      label: item.identificacion + ' - ' + item.nombres + ' ' + item.apellidos,
      value: item.idCliente,
    }))
  );
  public opcionesDeMeseros = computed(() =>
    this.meseros().map((item) => ({
      label: item.nombres + ' ' + item.apellidos,
      value: item.idMesero,
    }))
  );
  public opcionesDeSupervisores = computed(() =>
    this.supervisores().map((item) => ({
      label: item.nombres + ' ' + item.apellidos,
      value: item.idSupervisor,
    }))
  );

  public seleccionarCliente(clienteId: number): void {
    const cliente = this.clientes().find((c) => c.idCliente === clienteId) || null;
    this.clienteSeleccionado = clienteId;
    this.invoiceService.seleccionarCliente(cliente);
  }

  public seleccionarMesero(meseroId: number): void {
    const mesero = this.meseros().find((m) => m.idMesero === meseroId) || null;
    this.meseroSeleccionado = meseroId;
    this.invoiceService.seleccionarMesero(mesero);
  }

  public seleccionarSupervisor(supervisorId: number): void {
    const supervisor = this.supervisores().find((s) => s.idSupervisor === supervisorId) || null;
    this.supervisorSeleccionado = supervisorId;
    this.invoiceService.seleccionarSupervisor(supervisor);
  }
}
