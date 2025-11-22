import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sucursal } from './entities/sucursal.entity';
import { CreateSucursalDto } from './dto/create-sucursal.dto';
import { UpdateSucursalDto } from './dto/update-sucursal.dto';

@Injectable()
export class SucursalService {
  constructor(
    @InjectRepository(Sucursal)
    private sucursalRepo: Repository<Sucursal>,
  ) {}

  async create(createSucursalDto: CreateSucursalDto) {
    const nueva = this.sucursalRepo.create(createSucursalDto);
    return await this.sucursalRepo.save(nueva);
  }

  findAll() {
    return this.sucursalRepo.find({ relations: ['empresa'] });
  }

  // (Dejamos los otros métodos pendientes para no hacer lío ahora)
  findOne(id: number) { return `Action pending for #${id}`; }
  update(id: number, updateSucursalDto: UpdateSucursalDto) { return `Action pending`; }
  remove(id: number) { return `Action pending`; }
}