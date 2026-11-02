import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn
 } from 'typeorm';

@Entity('detalle_ventas')
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  id_venta: number;

  @Column({ type: 'int' })
  id_libro: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
}