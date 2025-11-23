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

  // MÉTODO NUEVO: Crear o Actualizar Stock
  async actualizarStock(id_producto: number, id_sucursal: number, cantidad: number) {
    // 1. Buscamos si ya existe registro de stock para ese producto en esa sucursal
    const stockExistente = await this.stockRepo.findOne({
      where: {
        producto: { id_producto: id_producto },
        sucursal: { id_sucursal: id_sucursal }
      }
    });

    if (stockExistente) {
      // 2a. Si existe, actualizamos la cantidad
      stockExistente.cantidad = cantidad;
      return await this.stockRepo.save(stockExistente);
    } else {
      // 2b. Si no existe, creamos el registro desde cero
      const nuevoStock = this.stockRepo.create({
        cantidad: cantidad,
        producto: { id_producto: id_producto } as any,
        sucursal: { id_sucursal: id_sucursal } as any
      });
      return await this.stockRepo.save(nuevoStock);
    }
  }


  findAll() {
    // Traemos la cantidad, PERO TAMBIÉN qué producto es y en qué sucursal está
    return this.stockRepo.find({ relations: ['producto', 'sucursal'] });
  }

  findOne(id: number) { return `Action pending`; }
  update(id: number, updateStockDto: UpdateStockDto) { return `Action pending`; }
  remove(id: number) { return `Action pending`; }
}