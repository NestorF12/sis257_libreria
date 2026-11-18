// src/usuarios/dto/create-usuario.dto.ts
import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: '74829104' })
  @IsString()
  @IsNotEmpty()
  telefono: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La clave debe tener al menos 6 caracteres' })
  clave: string; // 👈 ¡Esta es la que faltaba o no estaba expuesta!

  @ApiProperty({ example: 'vendedor', enum: ['vendedor', 'comprador'] })
  @IsString()
  @IsOptional()
  @IsIn(['vendedor', 'comprador'])
  rol?: string;
}