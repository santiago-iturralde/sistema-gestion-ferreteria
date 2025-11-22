export class RegisterAuthDto {
  // --- Datos de la Empresa ---
  nombre_empresa: string;
  cuit_dni: string;
  direccion: string;
  telefono: string;
  email_empresa: string;

  // --- Datos del Usuario (Dueño) ---
  nombre_completo: string;
  email_usuario: string;
  password: string;
}