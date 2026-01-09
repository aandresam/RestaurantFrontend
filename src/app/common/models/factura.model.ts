export interface Factura {
    idCliente: number;
    idMesa: number;
    idMesero: number;
    detalles: DetalleFactura[];
}

export interface DetalleFactura {
    idSupervisor: number;
    plato: string;
    valor: number;
}