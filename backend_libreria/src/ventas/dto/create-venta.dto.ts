import { 
    IsNotEmpty, 
    IsNumber, 
    IsInt,
    Min 
} from 'class-validator';

export class CreateVentaDto {
  @IsNumber({}, { message: 'El total debe ser un valor numérico' })
  @Min(0, { message: 'El total no puede ser negativo' })
  @IsNotEmpty({ message: 'El total de la venta es obligatorio' })
  total: number;

  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  id_usuario: number;
}