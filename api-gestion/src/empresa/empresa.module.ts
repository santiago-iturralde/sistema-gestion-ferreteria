import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; 
import { EmpresaService } from './empresa.service';
import { EmpresaController } from './empresa.controller';
import { Empresa } from './entities/empresa.entity'; // <--- Importar la entidad

@Module({
  imports: [TypeOrmModule.forFeature([Empresa])], 
  controllers: [EmpresaController],
  providers: [EmpresaService],
})
export class EmpresaModule {}