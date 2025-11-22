import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Stock } from './entities/stock.entity';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@Injectable()
export class StockService {
  constructor(
    @InjectRepository(Stock)
    private stockRepo: Repository<Stock>,
  ) {}

  async create(createStockDto: CreateStockDto) {
    // Acá guardamos cuántos hay
    const nuevoStock = this.stockRepo.create(createStockDto);
    return await this.stockRepo.save(nuevoStock);
  }

  findAll() {
    // Traemos la cantidad, PERO TAMBIÉN qué producto es y en qué sucursal está
    return this.stockRepo.find({ relations: ['producto', 'sucursal'] });
  }

  findOne(id: number) { return `Action pending`; }
  update(id: number, updateStockDto: UpdateStockDto) { return `Action pending`; }
  remove(id: number) { return `Action pending`; }
}