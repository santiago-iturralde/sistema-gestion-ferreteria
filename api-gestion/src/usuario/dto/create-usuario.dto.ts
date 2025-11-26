export class CreateUsuarioDto {
  nombre: string;
  email: string;
  password: string;
  rol: number;     // Recibimos el ID del rol (ej: 1 o 2)
  empresa: number; // Recibimos el ID de la empresa (ej: 1)
}