//aca se calculan las ventas del dia,la cantidad de ventas y los productos con bajop stock

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, MoreThan } from 'typeorm';
import { Venta } from '../venta/entities/venta.entity';
import { Producto } from '../producto/entities/producto.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Venta) private ventaRepo: Repository<Venta>,
    @InjectRepository(Producto) private productoRepo: Repository<Producto>,
  ) {}

  async getResumen() {
    // 1. DATOS DE HOY
    const hoyInicio = new Date();
    hoyInicio.setHours(0, 0, 0, 0);
    const hoyFin = new Date();
    hoyFin.setHours(23, 59, 59, 999);

    const ventasHoy = await this.ventaRepo.find({
      where: { fecha: Between(hoyInicio, hoyFin) }
    });
    const totalDineroHoy = ventasHoy.reduce((acc, venta) => acc + Number(venta.total), 0);

    // 2. ALERTAS STOCK
    const productos = await this.productoRepo.find({ where: { activo: true }, relations: ['stocks'] });
    const productosBajoStock = productos.filter(prod => {
      const stockTotal = prod.stocks.reduce((acc, item) => acc + item.cantidad, 0);
      return stockTotal <= prod.stock_minimo_alerta;
    }).map(prod => ({
        id: prod.id_producto,
        nombre: prod.nombre,
        stock_actual: prod.stocks.reduce((acc, item) => acc + item.cantidad, 0),
        stock_minimo: prod.stock_minimo_alerta
    }));

    // 3. DATOS PARA EL GRÁFICO (Últimos 7 días)
    const fechaLimite = new Date();
    fechaLimite.setDate(fechaLimite.getDate() - 7); 

    const ventasSemana = await this.ventaRepo.find({
      where: { fecha: MoreThan(fechaLimite) },
      order: { fecha: 'ASC' }
    });

    // --- CORRECCIÓN AQUÍ: Definimos que es un array de cualquier cosa (any[]) ---
    const graficoData: any[] = []; 

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        // Formato "DD/MM"
        const diaStr = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });

        const totalDia = ventasSemana
            .filter(v => new Date(v.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' }) === diaStr)
            .reduce((acc, v) => acc + Number(v.total), 0);

        graficoData.push({ nombre: diaStr, total: totalDia });
    }

    return {
      ventas_hoy_total: totalDineroHoy,
      ventas_hoy_cantidad: ventasHoy.length,
      alertas_stock: productosBajoStock,
      ventas_grafico: graficoData
    };
  }
}