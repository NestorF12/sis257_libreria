// src/ventas/ventas.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { VentasService } from './ventas.service';
import { CreateVentaDto } from './dto/create-venta.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Ventas')
@Controller('ventas')
export class VentasController {
  constructor(private readonly ventasService: VentasService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar una nueva venta/compra de libros' })
  create(@Body() createVentaDto: CreateVentaDto) {
    return this.ventasService.create(createVentaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas las ventas con sus detalles y usuario' })
  findAll() {
    return this.ventasService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener el detalle de una venta específica por ID' })
  findOne(@Param('id') id: string) {
    return this.ventasService.findOne(+id);
  }
}