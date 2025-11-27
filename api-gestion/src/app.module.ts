import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmpresaModule } from './empresa/empresa.module';
import { RolModule } from './rol/rol.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { ProductoModule } from './producto/producto.module';
import { SucursalModule } from './sucursal/sucursal.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { StockModule } from './stock/stock.module';
import { VentaModule } from './venta/venta.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { CompraModule } from './compra/compra.module';
import { ClienteModule } from './cliente/cliente.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        // Detectamos si estamos en la nube
        const isProd = process.env.DATABASE_URL;

        if (isProd) {
          console.log("🚀 MODO NUBE DETECTADO: Conectando a Neon...");
          return {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            autoLoadEntities: true,
            synchronize: true,
            ssl: { rejectUnauthorized: false }, 
          };
        } else {
          console.log("🏠 MODO LOCAL DETECTADO: Conectando a tu PC...");
          return {
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            
            // --- AQUÍ ESTABA EL ERROR, ASÍ SE ARREGLA: ---
            port: parseInt(process.env.DB_PORT || '5432'), 
            // ---------------------------------------------
            
            username: process.env.DB_USER || 'postgres',
            password: process.env.DB_PASSWORD || 'root', // Cambiá 'root' por tu pass local si es distinto
            database: process.env.DB_NAME || 'ferreteria_db',
            autoLoadEntities: true,
            synchronize: true,
          };
        }
      },
    }),

    EmpresaModule,
    RolModule,
    UsuarioModule,
    AuthModule,
    ProductoModule,
    SucursalModule,
    ProveedorModule,
    StockModule,
    VentaModule,
    DashboardModule,
    CompraModule,
    ClienteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}