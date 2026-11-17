// src/ventas/ventas.service.ts
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { DetalleVenta } from '../detalle_ventas/entities/detalle_venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { Usuario } from '../usuarios/entities/usuario.entity';
import { Libro } from '../libros/entities/libro.entity'; // Ajusta la ruta a tu entidad de libros

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,

    private readonly dataSource: DataSource, // Necesario para transacciones seguras
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const { usuarioId, detalles } = createVentaDto;

    // 1. Verificar si el usuario existe
    const usuario = await this.usuarioRepository.findOneBy({ id: usuarioId });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${usuarioId} no encontrado`);
    }

    // Usaremos un QueryRunner para asegurar que toda la operación sea atómica (transacción)
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let totalVenta = 0;
      const detallesVenta: DetalleVenta[] = [];

      for (const item of detalles) {
        // 2. Buscar el libro para verificar su precio y existencia
        const libro = await this.libroRepository.findOneBy({ id: item.libroId });
        if (!libro) {
          throw new NotFoundException(`Libro con ID ${item.libroId} no encontrado`);
        }

        // Asumiendo que tu entidad Libro tiene una propiedad 'precio' (cambia si se llama distinto)
        const precioUnitario = Number(libro.precio); 
        const subtotal = precioUnitario * item.cantidad;
        totalVenta += subtotal;

        // 3. Crear instancia del detalle
        const detalle = queryRunner.manager.create(DetalleVenta, {
          cantidad: item.cantidad,
          precioUnitario: precioUnitario,
          subtotal: subtotal,
          libro: libro,
        });

        detallesVenta.push(detalle);
      }

      // 4. Crear la cabecera de la venta
      const nuevaVenta = queryRunner.manager.create(Venta, {
        usuario: usuario,
        total: totalVenta,
        estado: 'completado',
        detalles: detallesVenta,
      });

      // 5. Guardar la venta completa en la base de datos
      const ventaGuardada = await queryRunner.manager.save(Venta, nuevaVenta);

      // Confirmar transacción
      await queryRunner.commitTransaction();
      return ventaGuardada;

    } catch (error: any) {
      // Revertir cambios si algo falla
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error al procesar la venta: ${error.message}`);
    } finally {
      // Liberar conexión
      await queryRunner.release();
    }
  }

async findAll(): Promise<Venta[]> {
    return await this.ventaRepository.find({
      relations: {
        usuario: true,
        detalles: {
          libro: true,
        },
      },
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: {
        usuario: true,
        detalles: {
          libro: true,
        },
      },
    });

    if (!venta) {
      throw new NotFoundException(`Venta con ID ${id} no encontrada`);
    }

    return venta;
  }
}