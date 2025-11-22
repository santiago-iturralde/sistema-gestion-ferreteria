import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';

@Entity('proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn()
  id_proveedor: number;

  @Column({ type: 'varchar' })
  razon_social: string; // Ej: "Distribuidora El Clavo S.A."

  @Column({ type: 'varchar', nullable: true })
  cuit: string;

  @Column({ type: 'varchar', nullable: true })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  // Relación: Muchos proveedores trabajan con una Empresa
  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;
}