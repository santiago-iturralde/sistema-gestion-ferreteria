export class CreateProveedorDto {
  razon_social: string;
  cuit?: string;      // Opcional
  telefono?: string;  // Opcional
  email?: string;     // Opcional
  empresa: number;    // El ID de la empresa 
}