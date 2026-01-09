import { Component, inject, OnInit } from '@angular/core';
import { NzCardModule } from 'ng-zorro-antd/card';
import { Cliente } from '../../common/models/cliente.model';
import { Mesa } from '../../common/models/mesa.model';
import { Mesero } from '../../common/models/mesero.model';
import { Plato } from '../../common/models/plato.model';
import { Supervisor } from '../../common/models/supervisor.model';
import { AddDishes } from './components/add-dishes/add-dishes';
import { ClientInfo } from './components/client-info/client-info';
import { InvoiceDetail } from './components/invoice-detail/invoice-detail';
import { ClienteService } from '../../common/services/cliente.service';
import { MesaService } from '../../common/services/mesa.service';
import { MeseroService } from '../../common/services/meseros.service';
import { SupervisorService } from '../../common/services/supervisor.service';

@Component({
  selector: 'app-welcome',
  imports: [ClientInfo, AddDishes, InvoiceDetail, NzCardModule],
  templateUrl: './invoice.html',
  styleUrl: './invoice.scss',
})
export class InvoiceComponent implements OnInit {
  private clienteService = inject(ClienteService);
  private meseroService = inject(MeseroService);
  private supervisorService = inject(SupervisorService);
  private mesaService = inject(MesaService);

  public clientes: Cliente[] | null = null;
  public meseros: Mesero[] | null = null;
  public supervisores: Supervisor[] | null = null;
  public mesas: Mesa[] | null = null;

  public platos: Plato[] = [
    {
      id: 1,
      plato: 'Bandeja paisa',
      valor: 25000,
    },
    {
      id: 2,
      plato: 'Ajiaco',
      valor: 18000,
    },
    {
      id: 3,
      plato: 'Lechona',
      valor: 14000,
    },
    {
      id: 4,
      plato: 'Corrientazo',
      valor: 13000,
    },
    {
      id: 5,
      plato: 'Pechuga gratinada al ajillo',
      valor: 30000,
    },
  ];

  ngOnInit() {
    this.cargarClientes();
    this.cargarMesas();
    this.cargarMeseros();
    this.cargarSupervisores();
  }

  public cargarClientes(): void {
    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes;
      },
      error: (error) => {
        console.error('Error al obtener los clientes:', error);
      },
    });
  }

  public cargarMesas(): void {
    this.mesaService.getMesas().subscribe({
      next: (mesas) => {
        this.mesas = mesas;
      },
      error: (error) => {
        console.error('Error al obtener las mesas:', error);
      },
    });
  }

  public cargarMeseros(): void {
    this.meseroService.getMeseros().subscribe({
      next: (meseros) => {
        this.meseros = meseros;
      },
      error: (error) => {
        console.error('Error al obtener los meseros:', error);
      },
    });
  }

  public cargarSupervisores(): void {
    this.supervisorService.getSupervisores().subscribe({
      next: (supervisores) => {
        this.supervisores = supervisores;
      },
      error: (error) => {
        console.error('Error al obtener los supervisores:', error);
      },
    });
  }
}
