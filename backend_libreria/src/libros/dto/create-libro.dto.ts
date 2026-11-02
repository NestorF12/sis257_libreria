import { 
    IsNotEmpty, 
    IsString, 
    IsNumber, 
    IsInt,
    Min,
    MaxLength 
} from 'class-validator';

export class CreateLibroDto {
  @IsString({ message: 'El título debe ser de tipo cadena' })
  @IsNotEmpty({ message: 'El título del libro es obligatorio' })
  @MaxLength(150, { message: 'El título no puede tener más de 150 caracteres' })
  titulo: string;

  @IsString({ message: 'El ISBN debe ser de tipo cadena' })
  @IsNotEmpty({ message: 'El ISBN es obligatorio' })
  @MaxLength(20, { message: 'El ISBN no puede tener más de 20 caracteres' })
  isbn: string;

  @IsNumber({}, { message: 'El precio debe ser un valor numérico' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  precio: number;

  @IsInt({ message: 'El stock debe ser un número entero' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  @IsNotEmpty({ message: 'El stock es obligatorio' })
  stock: number;

  @IsInt({ message: 'El ID del autor debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del autor es obligatorio' })
  id_autor: number;

  @IsInt({ message: 'El ID de la categoría debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la categoría es obligatorio' })
  id_categoria: number;
}