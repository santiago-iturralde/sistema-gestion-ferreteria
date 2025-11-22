import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProveedorService } from './proveedor.service';
import { ProveedorController } from './proveedor.controller';
import { Proveedor } from './entities/proveedor.entity'; // <--- Entidad

@Module({
  imports: [TypeOrmModule.forFeature([Proveedor])], // <--- Registrar
  controllers: [ProveedorController],
  providers: [ProveedorService],
})
export class ProveedorModule {}
