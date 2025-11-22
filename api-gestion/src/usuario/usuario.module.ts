import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario } from './entities/usuario.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario])], // crea la tabla
  controllers: [UsuarioController],
  providers: [UsuarioService],
  exports: [UsuarioService] // (Opcional: servirá si otro módulo necesita buscar usuarios)
})
export class UsuarioModule {}