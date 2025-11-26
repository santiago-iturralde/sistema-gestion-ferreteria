import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentaService } from './venta.service';
import { VentaController } from './venta.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from './entities/detalle-venta.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity';
import { Cliente } from '../cliente/entities/cliente.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta, Producto, Stock,Cliente])
  ],
  controllers: [VentaController],
  providers: [VentaService],
})
export class VentaModule {}