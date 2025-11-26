//aca se guarda quien vendio,en que sucursal, el total y la fecha

import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';
import { DetalleVenta } from './detalle-venta.entity'; 
@Entity('venta')
export class Venta {
  @PrimaryGeneratedColumn()
  id_venta: number;

  @CreateDateColumn()
  fecha: Date;

  @Column({ type: 'varchar', default: 'CONSUMIDOR FINAL' })
  cliente_nombre: string; // Por si queremos poner "Juan Perez"

  @Column({ type: 'varchar', default: 'EFECTIVO' })
  metodo_pago: string; // Efectivo, Debito, MercadoPago

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  // --- RELACIONES ---

  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' })
  empresa: Empresa;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'id_usuario' })
  usuario: Usuario; // El vendedor que hizo la venta

  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: 'id_sucursal' })
  sucursal: Sucursal; // Dónde se vendió

  // Una venta tiene muchos detalles (renglones)
  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta, { cascade: true })
  detalles: DetalleVenta[];
}