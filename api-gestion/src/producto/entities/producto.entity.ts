import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';

@Entity('producto')
export class Producto {
  @PrimaryGeneratedColumn()
  id_producto: number;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', nullable: true })
  descripcion: string;

  @Column({ type: 'varchar', unique: true }) // Código de barras
  cod_barras: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio_costo: number; 

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  precio_venta: number; 

  @Column({ type: 'int', default: 5 })
  stock_minimo_alerta: number; 

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  // --- RELACIONES (Solo las de tu diseño) ---

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Proveedor;
}