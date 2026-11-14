import { 
    IsNotEmpty, 
    IsString, 
    IsNumber, 
    IsInt,
    Min,
    MaxLength 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLibroDto {
  @ApiProperty({ example: 'Cien años de soledad', description: 'Título del libro' })
  @IsString({ message: 'El título debe ser de tipo cadena' })
  @IsNotEmpty({ message: 'El título del libro es obligatorio' })
  @MaxLength(150, { message: 'El título no puede tener más de 150 caracteres' })
  titulo: string;

  @ApiProperty({ example: '978-0307474728', description: 'Código ISBN del libro' })
  @IsString({ message: 'El ISBN debe ser de tipo cadena' })
  @IsNotEmpty({ message: 'El ISBN es obligatorio' })
  @MaxLength(20, { message: 'El ISBN no puede tener más de 20 caracteres' })
  isbn: string;

  @ApiProperty({ example: 15.50, description: 'Precio unitario del libro' })
  @IsNumber({}, { message: 'El precio debe ser un valor numérico' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  precio: number;

  @ApiProperty({ example: 10, description: 'Cantidad disponible en stock' })
  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @IsNotEmpty({ message: 'El stock es obligatorio' })
  stock: number;

  @ApiProperty({ example: 1, description: 'ID del autor asociado' })
  @IsInt({ message: 'El ID del autor debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del autor es obligatorio' })
  id_autor: number;

  @ApiProperty({ example: 1, description: 'ID de la categoría asociada' })
  @IsInt({ message: 'El ID de la categoría debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la categoría es obligatorio' })
  id_categoria: number;
}