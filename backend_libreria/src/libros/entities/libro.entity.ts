import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Autor } from '../../autores/entities/autor.entity';
import { Categoria } from '../../categorias/entities/categoria.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('libros')
export class Libro {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 150 })
  titulo: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  isbn: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  portada: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  stock: number;

  @ApiProperty({ description: 'ID del autor asociado', example: 1 })
  @Column({ nullable: true })
  autorId: number;

  @ManyToOne(() => Autor, (autor) => autor.libros, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'autorId' })
  autor: Autor;

  @Column({ nullable: true })
  categoriaId: number;

  @ManyToOne(() => Categoria, (categoria) => categoria.libros, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'categoriaId' })
  categoria: Categoria;
}