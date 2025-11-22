import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // <--- Importar esto
import { SucursalService } from './sucursal.service';
import { SucursalController } from './sucursal.controller';
import { Sucursal } from './entities/sucursal.entity'; // <--- Importar la entidad

@Module({
  imports: [TypeOrmModule.forFeature([Sucursal])], // <--- Registrar aquí
  controllers: [SucursalController],
  providers: [SucursalService],
})
export class SucursalModule {}