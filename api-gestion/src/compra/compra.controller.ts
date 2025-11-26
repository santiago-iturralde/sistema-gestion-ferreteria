import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CompraService } from './compra.service';

@Controller('compra')
export class CompraController {
  constructor(private readonly compraService: CompraService) {}

  // 1. REGISTRAR NUEVA COMPRA (POST)
  @Post()
  create(@Body() datosCompra: any) {
    // Recibimos el JSON con proveedor, sucursal, items, etc.
    return this.compraService.create(datosCompra);
  }

  // 2. LISTAR HISTORIAL DE COMPRAS (GET)
  @Get()
  findAll() {
    return this.compraService.findAll();
  }
}