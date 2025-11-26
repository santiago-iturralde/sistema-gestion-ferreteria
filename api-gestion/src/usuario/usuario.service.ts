import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
  ) {}

  // 1. CREAR
  async create(createUsuarioDto: CreateUsuarioDto) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(createUsuarioDto.password, salt);
    
    const nuevoUsuario = this.usuarioRepo.create({
      // CORRECCIÓN: Asignamos 'nombre' del formulario a 'nombre_completo' de la entidad
      nombre_completo: createUsuarioDto.nombre, 
      email: createUsuarioDto.email,
      password: passwordHash,
      rol: { id_rol: createUsuarioDto.rol } as any, 
      empresa: { id_empresa: createUsuarioDto.empresa } as any,
      activo: true
    });

    return this.usuarioRepo.save(nuevoUsuario);
  }

  // 2. LISTAR (Sin filtros, traemos todo para probar)
  findAll() {
    return this.usuarioRepo.find({
      relations: ['rol', 'empresa'] 
    });
  }

  // 3. BUSCAR UNO
  findOne(id: number) {
    return this.usuarioRepo.findOne({
      where: { id_usuario: id },
      relations: ['rol', 'empresa']
    });
  }

  // 4. BUSCAR POR EMAIL (LOGIN)
  findOneByEmail(email: string) {
    return this.usuarioRepo.findOne({ 
      where: { email },
      relations: ['rol'], 
      // CORRECCIÓN: Seleccionamos 'nombre_completo'
      select: ['id_usuario', 'nombre_completo', 'email', 'password', 'activo'] 
    });
  }

  update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioRepo.update(id, updateUsuarioDto as any);
  }

  async remove(id: number) {
    return await this.usuarioRepo.delete(id);
  }
}