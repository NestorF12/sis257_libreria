import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DetalleVentasService } from './detalle_ventas.service';
import { DetalleVentasController } from './detalle_ventas.controller';
import { DetalleVenta } from './entities/detalle_venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DetalleVenta])],
  controllers: [DetalleVentasController],
  providers: [DetalleVentasService],
})
export class DetalleVentasModule {}