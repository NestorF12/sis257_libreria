// src/ventas/entities/detalle-venta.entity.ts
import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { Venta } from './venta.entity';
// Importa tu entidad Libro (ajusta la ruta según tu estructura de carpetas)
import { Libro } from '../../libros/entities/libro.entity';

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'precio_unitario' })
  precioUnitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;

  // Relación: Muchos detalles pertenecen a una venta
  @ManyToOne(() => Venta, (venta) => venta.detalles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  // Relación: Un detalle apunta a un libro del catálogo
  @ManyToOne(() => Libro, { eager: true })
  @JoinColumn({ name: 'libro_id' })
  libro: Libro;
}