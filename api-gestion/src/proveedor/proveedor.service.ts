import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepo: Repository<Proveedor>,
  ) {}

  async create(createProveedorDto: CreateProveedorDto) {
    const nuevo = this.proveedorRepo.create(createProveedorDto);
    return await this.proveedorRepo.save(nuevo);
  }

  findAll() {
    return this.proveedorRepo.find({ relations: ['empresa'] });
  }

  findOne(id: number) { return `Action pending`; }
  update(id: number, updateProveedorDto: UpdateProveedorDto) { return `Action pending`; }
  remove(id: number) { return `Action pending`; }
}