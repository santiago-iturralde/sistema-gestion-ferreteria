import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/create-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';

@Controller('auth') // Esto define la ruta base: https://sistema-gestion-ferreteria-demo.onrender.com/auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') // Esto define la sub-ruta: /register
  register(@Body() datos: RegisterAuthDto) {
    return this.authService.register(datos);
  }

  @Post('login')
  login(@Body() datos: LoginAuthDto){
    return this.authService.login(datos);
  }
}