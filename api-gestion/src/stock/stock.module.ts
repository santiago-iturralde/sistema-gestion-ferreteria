import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';
import { Stock } from './entities/stock.entity'; // <--- Entidad

@Module({
  imports: [TypeOrmModule.forFeature([Stock])], // <--- Registrar
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}