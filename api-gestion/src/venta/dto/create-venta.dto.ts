export class CreateVentaDto {
  id_sucursal: number; // ¿Desde dónde vende? (Local o Depósito)
  id_usuario: number;  // ¿Quién vende? (Pepe)
  cliente_nombre: string;
  metodo_pago: string; // Efectivo, MP, etc.
  id_cliente?: number; // Opcional (si es consumidor final no viene)
  
  // La lista de productos (El Carrito)
  items: {
    id_producto: number;
    cantidad: number;
  }[];
}