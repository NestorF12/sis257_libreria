import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn, 
    ManyToOne, 
    JoinColumn 
} from 'typeorm';
import { Autor } from '../../autores/entities/autor.entity'; // 👈 Asegúrate de que la ruta sea correcta según tus carpetas
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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio: number;

  @Column({ type: 'int' })
  stock: number;

  // 1. El ID del autor (la clave foránea en la base de datos)
  @ApiProperty({ description: 'ID del autor asociado', example: 1 })
  @Column({ nullable: true }) // Ponlo en true si el libro puede existir sin autor temporalmente
  autorId: number;

  // 2. La propiedad 'autor' que conecta con la entidad Autor
  @ManyToOne(() => Autor, (autor) => autor.libros, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'autorId' }) // Vincula esta relación con la columna autorId de arriba
  autor: Autor;

  @Column({ nullable: true })
  categoriaId: number; // La llave foránea en la base de datos

  @ManyToOne(() => Categoria, (categoria) => categoria.libros, { 
    nullable: true,
    onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoriaId' })
  categoria: Categoria;

  // (Aquí iría también tu categoría si ya la tienes...)
}