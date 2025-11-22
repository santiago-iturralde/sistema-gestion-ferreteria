import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';
import { Rol } from '../../rol/entities/rol.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn()
  id_usuario: number;

  @Column({ type: 'varchar', length: 100 })
  nombre_completo: string;

  @Column({ type: 'varchar', unique: true })
  email: string; // Usaremos esto para el Login

  @Column({ type: 'varchar' })
  password: string; // Se guarda encriptada

  @Column({ type: 'boolean', default: true })
  activo: boolean; // Para desactivar empleados sin borrar historial

  @CreateDateColumn()
  created_at: Date;

  // --- RELACIONES (FOREIGN KEYS) ---

  // Relación: Muchos Usuarios pertenecen a Una Empresa
  @ManyToOne(() => Empresa)
  @JoinColumn({ name: 'id_empresa' }) 
  empresa: Empresa;

  // Relación: Muchos Usuarios tienen Un Rol
  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'id_rol' })
  rol: Rol;
}