import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompraService } from './compra.service';
import { Compra } from './entities/compra.entity';
import { DetalleCompra } from './entities/detalle-compra.entity';
import { Producto } from '../producto/entities/producto.entity';
import { Stock } from '../stock/entities/stock.entity'; // <--- Importante para actualizar stock
import { CompraController } from './compra.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Compra, DetalleCompra, Producto, Stock])
  ],
  controllers: [CompraController],
  providers: [CompraService],
})
export class CompraModule {}