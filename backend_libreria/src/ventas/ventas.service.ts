import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
  ) {}

  // CREATE: Registrar una nueva venta
  async create(createVentaDto: CreateVentaDto) {
    const nuevaVenta = this.ventaRepository.create(createVentaDto);
    return await this.ventaRepository.save(nuevaVenta);
  }

  // READ: Listar todas las ventas
  async findAll() {
    return await this.ventaRepository.find();
  }

  // READ: Buscar una venta por su ID
  async findOne(id: number) {
    const venta = await this.ventaRepository.findOneBy({ id });
    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }
    return venta;
  }

  // UPDATE: Actualizar una venta existente
  async update(id: number, updateVentaDto: UpdateVentaDto) {
    const venta = await this.findOne(id);
    this.ventaRepository.merge(venta, updateVentaDto);
    return await this.ventaRepository.save(venta);
  }

  // DELETE: Eliminar una venta
  async remove(id: number) {
    const venta = await this.findOne(id);
    return await this.ventaRepository.remove(venta);
  }
}