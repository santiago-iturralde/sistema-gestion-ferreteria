import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('rol')
export class Rol {
    // Agregamos { name: 'id_rol' } para asegurar que lea esa columna
    @PrimaryGeneratedColumn({ name: 'id_rol' })
    id_rol: number;

    // Agregamos { name: 'nombre_rol' }
    @Column({ name: 'nombre_rol', type: 'varchar', length: 50 })
    nombre_rol: string; 

    @Column({ type: 'varchar', nullable: true })
    descripcion: string;
}