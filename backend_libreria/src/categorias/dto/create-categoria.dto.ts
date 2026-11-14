import { 
    IsNotEmpty, 
    IsString, 
    IsOptional 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoriaDto {
  @ApiProperty({ 
    example: 'Ficción', 
    description: 'Nombre de la categoría' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la categoría es obligatorio' })
  nombre: string;

  @ApiProperty({ 
    example: 'Libros de novelas y literatura fantástica', 
    description: 'Descripción opcional de la categoría',
    required: false 
  })
  @IsString()
  @IsOptional()
  descripcion?: string;
}