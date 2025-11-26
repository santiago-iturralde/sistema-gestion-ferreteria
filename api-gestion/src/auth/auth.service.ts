import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'; 
import { RegisterAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto'; 
import * as bcrypt from 'bcrypt'; 
import { Empresa } from '../empresa/entities/empresa.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Rol } from '../rol/entities/rol.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepo: Repository<Empresa>,
    @InjectRepository(Usuario)
    private usuarioRepo: Repository<Usuario>,
    @InjectRepository(Rol)
    private rolRepo: Repository<Rol>,
    private jwtService: JwtService,
  ) {}

  async register(datos: RegisterAuthDto) {
    // 1. Crear la Empresa
    const nuevaEmpresa = this.empresaRepo.create({
      nombre_empresa: datos.nombre_empresa,
      cuit_dni: datos.cuit_dni,
      direccion: datos.direccion,
      telefono: datos.telefono,
      email: datos.email_empresa,
    });

    const empresaGuardada = await this.empresaRepo.save(nuevaEmpresa);

    // 2. Buscar el Rol de ADMIN (ID 1)
    const rolAdmin = await this.rolRepo.findOneBy({ id_rol: 1 });

    if(!rolAdmin){
      throw new Error('Error crítico: No existe el Rol ADMIN (ID 1) en la base de datos.');
    }

    // 3. Encriptar contraseña
    const passwordEncriptada = await bcrypt.hash(datos.password, 10);

    // 4. Crear el Usuario (Dueño)
    const nuevoUsuario = this.usuarioRepo.create({
      nombre_completo: datos.nombre_completo,
      email: datos.email_usuario,
      password: passwordEncriptada, 
      empresa: empresaGuardada,    
      rol: rolAdmin,                
    });
    
    await this.usuarioRepo.save(nuevoUsuario);

    return { message: 'Registro exitoso', empresa: empresaGuardada.nombre_empresa };
  }


  // --- FUNCIÓN LOGIN MODIFICADA PARA ENVIAR ROL ID ---
  async login(datos: LoginAuthDto) {
    const usuario = await this.usuarioRepo.findOne({
      where: { email: datos.email },
      relations: ['rol', 'empresa'], 
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas (Email no existe)');
    }

    const esPasswordValido = await bcrypt.compare(datos.password, usuario.password);

    if (!esPasswordValido) {
      throw new UnauthorizedException('Credenciales inválidas (Password incorrecto)');
    }

    // Generar Token
    const payload = { 
      id: usuario.id_usuario, 
      email: usuario.email, 
      rol: usuario.rol ? usuario.rol.nombre_rol : 'SIN_ROL',
      id_empresa: usuario.empresa ? usuario.empresa.id_empresa : null 
    };

    const token = this.jwtService.sign(payload);

    // DEVOLVEMOS EL TOKEN Y LOS DATOS DEL USUARIO (INCLUIDO EL OBJETO ROL)
    return {
      message: 'Login exitoso',
      access_token: token, // Usamos 'access_token' por estándar
      usuario: {
        nombre: usuario.nombre_completo,
        email: usuario.email,
        rol: usuario.rol // Enviamos todo el objeto rol { id_rol: 1, nombre_rol: 'ADMIN' }
      }
    };
  }
}