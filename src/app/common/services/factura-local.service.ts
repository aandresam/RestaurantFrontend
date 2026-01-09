import { computed, Injectable, signal } from '@angular/core';
import { Cliente } from '../models/cliente.model';
import { Factura } from '../models/factura.model';
import { Mesa } from '../models/mesa.model';
import { Mesero } from '../models/mesero.model';
import { Plato } from '../models/plato.model';
import { Supervisor } from '../models/supervisor.model';

@Injectable({
  providedIn: 'root',
})
export class FacturaLocalService {
  private platos = signal<Plato[]>(this.cargarPlatosDesdeStorage());
  private factura = signal<Factura | null>(null);

  public platosSeleccionados = this.platos.asReadonly();

  private cliente = signal<Cliente | null>(this.cargarClienteSeleccionadoDesdeStorage());
  private mesero = signal<Mesero | null>(this.cargarMeseroSeleccionadoDesdeStorage());
  private supervisor = signal<Supervisor | null>(this.cargarSupervisorSeleccionadoDesdeStorage());
  private mesa = signal<Mesa | null>(this.cargarMesaSeleccionadaDesdeStorage());

  public clienteSeleccionado = this.cliente.asReadonly();
  public meseroSeleccionado = this.mesero.asReadonly();
  public supervisorSeleccionado = this.supervisor.asReadonly();
  public mesaSeleccionada = this.mesa.asReadonly();

  public facturaEsValida = computed(() => {
    return (
      this.cliente() !== null &&
      this.mesero() !== null &&
      this.supervisor() !== null &&
      this.mesa() !== null &&
      this.platos().length > 0
    );
  });

  public agregarPlato(plato: Plato): void {
    const existePlato = this.platos().some((p) => p.id === plato.id);
    if (existePlato) {
      this.platos.update((platosActuales) => {
        return platosActuales.map((p) =>
          p.id === plato.id
            ? {
                ...p,
                valor: p.valor + plato.valor,
                cantidad: (p.cantidad || 1) + 1,
              }
            : p
        );
      });
    } else {
      const actuales = this.platos();
      this.platos.set([...actuales, plato]);
    }
    this.guardarPlatosEnStorage();
  }

  public eliminarPlato(platoId: number): void {
    const actuales = this.platos();
    console.log(actuales);
    this.platos.set(actuales.filter((p) => p.id !== platoId));
    this.guardarPlatosEnStorage();
  }

  public restarCantidadPlato(platoId: number): void {
    this.platos.update((platosActuales) => {
      return platosActuales.map((p) => {
        if (p.id === platoId && (p.cantidad || 1) > 1) {
          return {
            ...p,
            valor: p.valor - p.valor / (p.cantidad || 1),
            cantidad: (p.cantidad || 1) - 1,
          };
        }
        return p;
      });
    });
    this.guardarPlatosEnStorage();
  }

  public guardarPlatosEnStorage(): void {
    localStorage.setItem('platosSeleccionados', JSON.stringify(this.platos()));
  }

  public cargarPlatosDesdeStorage(): Plato[] {
    const cached = localStorage.getItem('platosSeleccionados');
    return cached ? (JSON.parse(cached) as Plato[]) : [];
  }

  public seleccionarCliente(cliente: Cliente | null): void {
    this.cliente.set(cliente);
    this.guardarClienteSeleccionado();
  }

  public seleccionarMesero(mesero: Mesero | null): void {
    this.mesero.set(mesero);
    this.guardarMeseroSeleccionado();
  }

  public seleccionarSupervisor(supervisor: Supervisor | null): void {
    this.supervisor.set(supervisor);
    this.guardarSupervisorSeleccionado();
  }

  public seleccionarMesa(mesa: Mesa | null): void {
    this.mesa.set(mesa);
    this.guardarMesaSeleccionada();
  }

  public generarFactura(): Factura | null {
    const cliente = this.clienteSeleccionado();
    const mesero = this.meseroSeleccionado();
    const supervisor = this.supervisorSeleccionado();
    const mesa = this.mesaSeleccionada();
    console.log('Generando factura con:', {
      cliente,
      mesero,
      supervisor,
      mesa,
      platos: this.platosSeleccionados(),
    });
    if (cliente && mesero && supervisor && mesa) {
      const factura: Factura = {
        idCliente: cliente.idCliente,
        idMesa: mesa.id,
        idMesero: mesero.idMesero,
        detalles: this.platosSeleccionados().map((plato) => ({
          plato: plato.plato,
          valor: plato.valor,
          idSupervisor: supervisor.idSupervisor,
        })),
      };
      this.factura.set(factura);
    }
    return this.factura();
  }

  public limpiarFactura(): void {
    this.platos.set([]);
    this.cliente.set(null);
    this.mesero.set(null);
    this.supervisor.set(null);
    this.mesa.set(null);
    localStorage.removeItem('platosSeleccionados');
    localStorage.removeItem('clienteSeleccionado');
    localStorage.removeItem('meseroSeleccionado');
    localStorage.removeItem('supervisorSeleccionado');
    localStorage.removeItem('mesaSeleccionada');
  }

  private guardarClienteSeleccionado(): void {
    localStorage.setItem('clienteSeleccionado', JSON.stringify(this.cliente()));
  }

  private cargarClienteSeleccionadoDesdeStorage(): Cliente | null {
    const cached = localStorage.getItem('clienteSeleccionado');
    return cached ? (JSON.parse(cached) as Cliente) : null;
  }

  private guardarMeseroSeleccionado(): void {
    localStorage.setItem('meseroSeleccionado', JSON.stringify(this.mesero()));
  }

  private cargarMeseroSeleccionadoDesdeStorage(): Mesero | null {
    const cached = localStorage.getItem('meseroSeleccionado');
    return cached ? (JSON.parse(cached) as Mesero) : null;
  }

  private guardarSupervisorSeleccionado(): void {
    localStorage.setItem('supervisorSeleccionado', JSON.stringify(this.supervisor()));
  }

  private cargarSupervisorSeleccionadoDesdeStorage(): Supervisor | null {
    const cached = localStorage.getItem('supervisorSeleccionado');
    return cached ? (JSON.parse(cached) as Supervisor) : null;
  }

  private guardarMesaSeleccionada(): void {
    localStorage.setItem('mesaSeleccionada', JSON.stringify(this.mesa()));
  }

  private cargarMesaSeleccionadaDesdeStorage(): Mesa | null {
    const cached = localStorage.getItem('mesaSeleccionada');
    return cached ? (JSON.parse(cached) as Mesa) : null;
  }
}
