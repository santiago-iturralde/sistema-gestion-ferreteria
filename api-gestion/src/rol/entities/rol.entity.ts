import { Column, Entity,PrimaryGeneratedColumn} from "typeorm";

@Entity('rol')
export class Rol{
    @PrimaryGeneratedColumn()
    id_rol: number;

    @Column({ type: 'varchar', length: 50 })
    nombre_rol: string; // Ej: 'ADMIN', 'CAJERO'

    @Column({ type: 'varchar', nullable: true })
    descripcion: string;
}