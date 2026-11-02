import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DetalleVenta } from './entities/detalle_venta.entity';
import { CreateDetalleVentaDto } from './dto/create-detalle_venta.dto';
import { UpdateDetalleVentaDto } from './dto/update-detalle_venta.dto';

@Injectable()
export class DetalleVentasService {
  constructor(
    @InjectRepository(DetalleVenta)
    private readonly detalleVentaRepository: Repository<DetalleVenta>,
  ) {}

  async create(createDetalleVentaDto: CreateDetalleVentaDto) {
    const nuevoDetalle = this.detalleVentaRepository.create(createDetalleVentaDto);
    return await this.detalleVentaRepository.save(nuevoDetalle);
  }

  async findAll() {
    return await this.detalleVentaRepository.find();
  }

  async findOne(id: number) {
    const detalle = await this.detalleVentaRepository.findOneBy({ id });
    if (!detalle) {
      throw new NotFoundException(`Detalle de_venta con ID ${id} no encontrado`);
    }
    return detalle;
  }

  async update(id: number, updateDetalleVentaDto: UpdateDetalleVentaDto) {
    const detalle = await this.findOne(id);
    this.detalleVentaRepository.merge(detalle, updateDetalleVentaDto);
    return await this.detalleVentaRepository.save(detalle);
  }

  async remove(id: number) {
    const detalle = await this.findOne(id);
    return await this.detalleVentaRepository.remove(detalle);
  }
}