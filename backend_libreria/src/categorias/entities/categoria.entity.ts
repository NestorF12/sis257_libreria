import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn,
    OneToMany 
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Libro } from '../../libros/entities/libro.entity'; // Ajusta la ruta si es necesario

@Entity('categorias')
export class Categoria {
  @ApiProperty({ example: 1, description: 'ID único de la categoría' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Ficción', description: 'Nombre de la categoría' })
  @Column({ type: 'varchar', length: 50, unique: true })
  nombre: string;

  @ApiProperty({ 
    example: 'Libros de novelas y relatos de ficción', 
    description: 'Descripción detallada de la categoría',
    required: false 
  })
  @Column({ type: 'text', nullable: true })
  descripcion: string;

  // Relación opcional con Libros (para traer los libros de esta categoría)
  @ApiProperty({ type: () => [Libro], required: false })
  @OneToMany(() => Libro, (libro) => libro.categoria)
  libros: Libro[];
}