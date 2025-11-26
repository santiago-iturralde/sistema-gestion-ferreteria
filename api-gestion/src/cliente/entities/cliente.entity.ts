//Acá definimos que el cliente tiene nombre, datos de contacto y lo más importante: el saldo_deudor (cuánta plata nos debe).

import { Column,Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity('cliente')
export class Cliente {
    @PrimaryGeneratedColumn()
    id_cliente: number;

    @Column({ type: 'varchar'})
    nombre_completo: string;

    @Column({ type: 'varchar', nullable: true })
    telefono: string;

    @Column({ type: 'varchar', nullable: true })
    direccion: string;

    // Si es mayor a 0, nos debe plata.
    // default: 0 significa que arranca sin deudas.
    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    saldo_deudor: number;
}
