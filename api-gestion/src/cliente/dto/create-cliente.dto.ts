//Definimos qué datos necesitamos para crear un cliente nuevo

export class CreateClienteDto {
    nombre_completo: string;
    telefono?: string;
    direccion?: string;
}
