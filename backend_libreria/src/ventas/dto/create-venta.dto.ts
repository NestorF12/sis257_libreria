// src/ventas/dto/create-venta.dto.ts
import { IsArray, IsNotEmpty, IsNumber, ArrayMinSize, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class DetalleVentaDto {
  @ApiProperty({ example: 1, description: 'ID del libro que se está comprando' })
  @IsNotEmpty({ message: 'El ID del libro es obligatorio' })
  @IsNumber()
  libroId: number;

  @ApiProperty({ example: 2, description: 'Cantidad de ejemplares' })
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @IsNumber()
  cantidad: number;
}

export class CreateVentaDto {
  @ApiProperty({ example: 1, description: 'ID del usuario que realiza la compra' })
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsNumber()
  usuarioId: number;

  @ApiProperty({ type: [DetalleVentaDto], description: 'Lista de libros y cantidades en el carrito' })
  @IsArray()
  @ArrayMinSize(1, { message: 'La venta debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => DetalleVentaDto)
  detalles: DetalleVentaDto[];
}