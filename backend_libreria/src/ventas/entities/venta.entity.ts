import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
    CreateDateColumn 
} from 'typeorm';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn({ type: 'timestamp' })
  fecha: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  @Column({ type: 'int' })
  id_usuario: number;
}