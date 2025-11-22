import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';   //para importar las 3 entidades (usuario,rol y empresa)
import { JwtModule } from '@nestjs/jwt';  //para los JWtoken
import { JwtStrategy } from './jwt.strategy';  //para validar token con la palabra clave
import { ConfigModule, ConfigService } from '@nestjs/config'; 
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
// Importamos las entidades que vamos a usar
import { Empresa } from '../empresa/entities/empresa.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Rol } from '../rol/entities/rol.entity';

@Module({
  imports: [
    // Esto nos permite guardar datos en estas tablas desde Auth
    TypeOrmModule.forFeature([Empresa, Usuario, Rol]), 
    // --- CONFIGURACIÓN DE JWT ---
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET') || 'PalabraSecretaGestion',
        signOptions: { expiresIn: '1d' }, // El token dura 1 día
      }),
    }),
    //-------------------------------------------------------------
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}