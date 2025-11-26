import { Injectable } from '@nestjs/common'; // <--- ESTO ES CLAVE
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { Proveedor } from './entities/proveedor.entity';

@Injectable() // <--- SI FALTA ESTO, EL CONTROLADOR NO LO VE
export class ProveedorService { // <--- SI FALTA 'export', EL IMPORT FALLA
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepo: Repository<Proveedor>,
  ) {}

  // 1. CREAR
  create(createProveedorDto: CreateProveedorDto) {
    const nuevo = this.proveedorRepo.create({
      razon_social: createProveedorDto.razon_social,
      cuit: createProveedorDto.cuit,
      telefono: createProveedorDto.telefono,
      email: createProveedorDto.email,
      empresa: { id_empresa: createProveedorDto.empresa } as any 
    });
    
    return this.proveedorRepo.save(nuevo);
  }

  // 2. LISTAR
  findAll() {
    return this.proveedorRepo.find({
      order: { razon_social: 'ASC' }
    });
  }

  // 3. BUSCAR UNO
  findOne(id: number) {
    return this.proveedorRepo.findOneBy({ id_proveedor: id });
  }

  // 4. ACTUALIZAR
  update(id: number, updateProveedorDto: UpdateProveedorDto) {
    return this.proveedorRepo.update(id, updateProveedorDto as any);
  }

  // 5. BORRAR
  async remove(id: number) {
    return await this.proveedorRepo.delete(id);
  }
}