import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { Venta } from '../venta/entities/venta.entity'; 
import { Producto } from '../producto/entities/producto.entity'; 

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, Producto]) // <--- Habilitar acceso a tablas
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}