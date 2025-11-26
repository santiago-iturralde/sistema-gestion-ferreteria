import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm'; 
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Producto } from '../producto/entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Cliente } from '../cliente/entities/cliente.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta) private ventaRepo: Repository<Venta>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
    @InjectRepository(Stock) private stockRepo: Repository<Stock>,
    @InjectRepository(Cliente) private clienteRepo: Repository<Cliente>,
    private dataSource: DataSource, 
  ) {}

  async create(createVentaDto: CreateVentaDto) {
    const { id_sucursal, id_usuario, items, metodo_pago, id_cliente } = createVentaDto;
    // Tomamos nombre por defecto, pero luego intentamos buscar el real
    let nombreFinalCliente = createVentaDto.cliente_nombre || 'CONSUMIDOR FINAL';

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalVenta = 0;
      const detallesGuardar: DetalleVenta[] = [];

      // 1. RECORRER ITEMS Y DESCONTAR STOCK (Esto ya lo tenías bien)
      for (const item of items) {
        const producto = await this.productoRepo.findOneBy({ id_producto: item.id_producto });
        if (!producto) throw new BadRequestException(`Producto ID ${item.id_producto} no existe`);

        const stock = await this.stockRepo.findOne({
          where: { 
            sucursal: { id_sucursal: id_sucursal }, 
            producto: { id_producto: item.id_producto } 
          }
        });

        if (!stock || stock.cantidad < item.cantidad) {
          throw new BadRequestException(`No hay suficiente stock de ${producto.nombre}`);
        }

        stock.cantidad -= item.cantidad;
        await queryRunner.manager.save(stock); 

        const subtotal = producto.precio_venta * item.cantidad;
        totalVenta += subtotal;

        const detalle = new DetalleVenta();
        detalle.producto = producto;
        detalle.cantidad = item.cantidad;
        detalle.precio_unitario = producto.precio_venta;
        detalle.subtotal = subtotal;
        detallesGuardar.push(detalle);
      }

      // --- 1.5 LÓGICA DE FIADO (CUENTA CORRIENTE) ---
      // Si viene un ID de cliente, lo buscamos para usar su nombre real y actualizar saldo
      if (id_cliente) {
        const clienteEncontrado = await this.clienteRepo.findOneBy({ id_cliente });
        
        if (clienteEncontrado) {
          nombreFinalCliente = clienteEncontrado.nombre_completo;
          
          // ¡SI ES CUENTA CORRIENTE, LE SUMAMOS LA DEUDA!
          if (metodo_pago === 'Cuenta Corriente') {
            clienteEncontrado.saldo_deudor = Number(clienteEncontrado.saldo_deudor) + totalVenta;
            // Guardamos el cliente actualizado dentro de la transacción
            await queryRunner.manager.save(clienteEncontrado);
          }
        }
      }
      // ------------------------------------------------

      // 2. CREAR VENTA
      const venta = new Venta();
      venta.fecha = new Date();
      venta.sucursal = { id_sucursal } as any;
      venta.usuario = { id_usuario } as any;
      venta.cliente_nombre = nombreFinalCliente; // Usamos el nombre validado
      venta.metodo_pago = metodo_pago;
      venta.total = totalVenta;
      venta.detalles = detallesGuardar; 

      const ventaGuardada = await queryRunner.manager.save(venta);

      await queryRunner.commitTransaction();

      return { status: 'success', id_venta: ventaGuardada.id_venta, total: totalVenta };

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Listar ventas
  findAll() {
    return this.ventaRepo.find({
      relations: ['sucursal', 'usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' } 
    });
  }
}