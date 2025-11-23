import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sucursal } from '../../sucursal/entities/sucursal.entity';
import { Producto } from '../../producto/entities/producto.entity';

@Entity('stock')
export class Stock {
  @PrimaryGeneratedColumn()
  id_stock: number;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  // Relación: Stock pertenece a una Sucursal
  @ManyToOne(() => Sucursal)
  @JoinColumn({ name: 'id_sucursal' })
  sucursal: Sucursal;

  // Relación: Stock pertenece a un Producto
  @ManyToOne(() => Producto, (producto) => producto.stocks) 
  @JoinColumn({ name: 'id_producto' })
  producto: Producto;
}