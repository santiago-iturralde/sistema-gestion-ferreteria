//funcion que recibe los datos, encripta la contraseña, guarda la empresa y guarda al usuario conectado a esa empresa y con rol de ADMIN
import { Injectable,UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt'; //logica del token
import { RegisterAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto'; // <--- Importar DTO
import * as bcrypt from 'bcrypt'; // Librería para encriptar
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
    private jwtService: JwtService,  //agrego el servicio de JWT
  ) {}

  async register(datos: RegisterAuthDto) {
    // 1. Crear la Empresa primero
    const nuevaEmpresa = this.empresaRepo.create({
      nombre_empresa: datos.nombre_empresa,
      cuit_dni: datos.cuit_dni,
      direccion: datos.direccion,
      telefono: datos.telefono,
      email: datos.email_empresa,
    });

    const empresaGuardada = await this.empresaRepo.save(nuevaEmpresa);

    // 2. Buscar el Rol de ADMIN (Sabemos que es el ID 1 porque lo insertamos antes)
    const rolAdmin = await this.rolRepo.findOneBy({ id_rol: 1 });

    if(!rolAdmin){
      throw new Error('Error crítico: No existe el Rol ADMIN (ID 1) en la base de datos.');
    }

    // 3. Encriptar la contraseña
    const passwordEncriptada = await bcrypt.hash(datos.password, 10);

    // 4. Crear el Usuario (Dueño)
    const nuevoUsuario = this.usuarioRepo.create({
      nombre_completo: datos.nombre_completo,
      email: datos.email_usuario,
      password: passwordEncriptada, // Guardamos la encriptada
      empresa: empresaGuardada,     // Conectamos con la empresa creada
      rol: rolAdmin,                // Le damos poder de Admin
    });
    
    await this.usuarioRepo.save(nuevoUsuario);

    return { message: 'Registro exitoso', empresa: empresaGuardada.nombre_empresa };
  }


  // --- NUEVA FUNCIÓN LOGIN ---
  async login(datos: LoginAuthDto) {
    // 1. Buscar usuario por email (incluyendo su Rol y Empresa para saber quién es)
    const usuario = await this.usuarioRepo.findOne({
      where: { email: datos.email },
      relations: ['rol', 'empresa'], // Traeme también los datos relacionados
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas (Email no existe)');
    }

    // 2. Comparar contraseña (la que manda vs la encriptada)
    const esPasswordValido = await bcrypt.compare(datos.password, usuario.password);

    if (!esPasswordValido) {
      throw new UnauthorizedException('Credenciales inválidas (Password incorrecto)');
    }

    // 3. Generar el "Carnet" (Token)
    const payload = { 
      id: usuario.id_usuario, 
      email: usuario.email, 
      rol: usuario.rol.nombre_rol,
      id_empresa: usuario.empresa.id_empresa 
    };

    const token = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      token: token, 
      usuario: usuario.nombre_completo,
      rol: usuario.rol.nombre_rol
    };
  }
}
