import { 
    Column, 
    Entity, 
    PrimaryGeneratedColumn,
    OneToMany
} from 'typeorm';
import { Libro } from '../../libros/entities/libro.entity'; // 👈 Asegúrate de ajustar esta ruta según dónde tengas tu entidad Libro
import { ApiProperty } from '@nestjs/swagger';

@Entity('autores')
export class Autor {
  @ApiProperty({ description: 'ID único del autor', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Nombre del autor', example: 'Gabriel' })
  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @ApiProperty({ description: 'Apellido del autor', example: 'García Márquez' })
  @Column({ type: 'varchar', length: 100 })
  apellido: string;

  @ApiProperty({ description: 'Nacionalidad del autor', example: 'Colombiana', required: false })
  @Column({ type: 'varchar', length: 50, nullable: true })
  nacionalidad: string;

  // 👇 Relación inversa: Un autor tiene muchos libros (necesaria para el join)
  @OneToMany(() => Libro, (libro) => libro.autor)
  libros: Libro[];
}