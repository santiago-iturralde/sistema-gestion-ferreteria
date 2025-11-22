//manual de instrucciones para el "portero" que verifica tokens
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      // 1. ¿De dónde saco el token? Del encabezado "Authorization: Bearer ..."
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Si venció, no pasa
      // 2. ¿Con qué palabra secreta verifico que es real?
      secretOrKey: configService.get('JWT_SECRET') || 'PalabraSecretaGestion',
    });
  }

  // Si el token es válido, esto me devuelve los datos del usuario
  async validate(payload: any) {
    return { 
      id_usuario: payload.id, 
      email: payload.email, 
      rol: payload.rol, 
      id_empresa: payload.id_empresa 
    };
  }
}