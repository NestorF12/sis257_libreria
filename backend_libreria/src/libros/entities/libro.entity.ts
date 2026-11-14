import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn
 } from 'typeorm';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'varchar', unique: true, length: 20 })
  isbn: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ type: 'int' })
  autorId: number;

  @Column({ type: 'int' })
  categoriaId: number;
}