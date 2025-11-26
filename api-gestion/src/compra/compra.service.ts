import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity';

@Injectable()
export class CompraService {
  constructor(
    @InjectRepository(Compra) private compraRepo: Repository<Compra>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
    @InjectRepository(Stock) private stockRepo: Repository<Stock>,
    private dataSource: DataSource,
  ) {}

  // 1. CREAR COMPRA Y SUMAR STOCK
  async create(datos: any) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalCompra = 0;
      const detallesGuardar: DetalleCompra[] = [];

      for (const item of datos.items) {
        // A. Validar Producto
        const producto = await this.productoRepo.findOneBy({ id_producto: item.id_producto });
        if (!producto) throw new BadRequestException(`Producto ${item.id_producto} no existe`);

        // B. Buscar STOCK en esa sucursal
        let stock = await this.stockRepo.findOne({
          where: { 
            sucursal: { id_sucursal: datos.id_sucursal }, 
            producto: { id_producto: item.id_producto } 
          }
        });

        // C. Si no existe stock ahí, lo creamos en 0
        if (!stock) {
          stock = this.stockRepo.create({
            sucursal: { id_sucursal: datos.id_sucursal } as any,
            producto: { id_producto: item.id_producto } as any,
            cantidad: 0
          });
        }

        // D. SUMAR STOCK (Magia aquí ✨)
        stock.cantidad += Number(item.cantidad);
        await queryRunner.manager.save(stock);

        // E. Preparar detalle
        const subtotal = item.cantidad * item.precio_costo;
        totalCompra += subtotal;

        const detalle = new DetalleCompra();
        detalle.producto = producto;
        detalle.cantidad = item.cantidad;
        detalle.precio_costo_unitario = item.precio_costo;
        detalle.subtotal = subtotal;
        detallesGuardar.push(detalle);
      }

      // 2. Guardar Cabecera
      const compra = new Compra();
      compra.fecha = new Date();
      compra.proveedor = { id_proveedor: datos.id_proveedor } as any;
      compra.sucursal = { id_sucursal: datos.id_sucursal } as any;
      compra.usuario = { id_usuario: datos.id_usuario } as any; // Quién lo cargó
      compra.total = totalCompra;
      compra.detalles = detallesGuardar;

      const compraGuardada = await queryRunner.manager.save(compra);
      await queryRunner.commitTransaction();

      return compraGuardada;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // 2. LISTAR COMPRAS (Para el historial)
  findAll() {
    return this.compraRepo.find({
      relations: ['proveedor', 'sucursal', 'usuario', 'detalles', 'detalles.producto'],
      order: { fecha: 'DESC' }
    });
  }
}