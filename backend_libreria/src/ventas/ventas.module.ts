// src/ventas/ventas.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from '../detalle_ventas/entities/detalle_venta.entity';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Libro } from '../libros/entities/libro.entity'; // Ajusta la ruta a tu módulo de libros

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, DetalleVenta, Usuario, Libro]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
})
export class VentasModule {}