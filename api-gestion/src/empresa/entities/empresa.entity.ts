import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('empresa') // crea una tabla llamada empresa en la base de datos
export class Empresa{
    @PrimaryGeneratedColumn()
    id_empresa: number; // el id que se incrementa

    @Column({ type: 'varchar', length: 100 })
    nombre_empresa: string;

    @Column({ type: 'varchar', length: 20, unique: true })
    cuit_dni: string; // Unico para que no se repita el CUIT

    @Column({ type: 'varchar', nullable: true }) // nullable = puede ser null
    direccion: string;

    @Column({ type: 'varchar', nullable: true })
    telefono: string;

    @Column({ type: 'varchar', nullable: true })
    email: string;

    @Column({ type: 'varchar', nullable: true })
    web: string;

    @CreateDateColumn() // Se llena sola con la fecha actual
    created_at: Date;
}