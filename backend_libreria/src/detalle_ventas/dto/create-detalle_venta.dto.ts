import { 
    IsNotEmpty, 
    IsNumber, 
    IsInt,
    Min 
} from 'class-validator';

export class CreateDetalleVentaDto {
  @IsInt({ message: 'El ID de la venta debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID de la venta es obligatorio' })
  id_venta: number;

  @IsInt({ message: 'El ID del libro debe ser un número entero' })
  @IsNotEmpty({ message: 'El ID del libro es obligatorio' })
  id_libro: number;

  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad mínima debe ser al menos 1' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantidad: number;

  @IsNumber({}, { message: 'El subtotal debe ser un valor numérico' })
  @IsNotEmpty({ message: 'El subtotal es obligatorio' })
  subtotal: number;
}