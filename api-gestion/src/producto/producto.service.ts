import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private productoRepo: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto) {
    const nuevo = this.productoRepo.create(createProductoDto);
    return await this.productoRepo.save(nuevo);
  }

  findAll() {
    return this.productoRepo.find({
      where: { activo: true }, // Solo trae los que no están borrados
      relations: ['empresa', 'proveedor'] 
    });
  }

  // 1. BUSCAR UNO SOLO (Para llenar el formulario de edición)
  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({
      where: { id_producto: id },
      relations: ['empresa', 'proveedor'] // Traemos los datos relacionados
    });
    return producto;
  }


  // 2. ACTUALIZAR (El Update real)
  async update(id: number, updateProductoDto: UpdateProductoDto) {
    // .update(ID, DATOS_NUEVOS)
    return await this.productoRepo.update(id, updateProductoDto);
  }
  
  // 2. MODIFICAMOS EL REMOVE (BORRADO LÓGICO)
  async remove(id: number) {
    // Buscamos el producto
    const producto = await this.productoRepo.findOneBy({ id_producto: id });
    if (producto) {
      producto.activo = false; // <--- Lo "apagamos"
      return await this.productoRepo.save(producto); // Guardamos el cambio
    }
    return null;
  }
}