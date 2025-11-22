import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';

@Entity('sucursal')
export class Sucursal {
  @PrimaryGeneratedColumn()
  id_sucursal: number;

  @Column({ type: 'varchar' })
  nombre_sucursal: string; // Ej: "Local Centro", "Depósito"

  @Column({ type: 'varchar', nullable: true })
  direccion: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'boolean', default: false })
  es_casa_central: boolean; // Para identificar la principal

  // Relación: Muchas sucursales pertenecen a una Empresa
  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}