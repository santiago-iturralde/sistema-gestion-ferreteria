import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Proveedor } from '../../proveedor/entities/proveedor.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';
import { DetalleCompra } from './detalle-compra.entity'; 

@Entity('compra')
export class Compra {
  @PrimaryGeneratedColumn()
  id_compra: number;

  @CreateDateColumn()
  fecha: Date;
 
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // --- RELACIONES CON IDs EXPLÍCITOS ---

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'id_proveedor' })
  proveedor: Proveedor;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario;

  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: 'id_sucursal' })
  sucursal: Sucursal;

  @OneToMany(() => DetalleCompra, (detalle) => detalle.compra, { cascade: true })
  detalles: DetalleCompra[];
}