import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(150, { message: 'El nombre no debe exceder los 150 caracteres' })
  readonly nombre: string;

  @ApiProperty({ example: '74829104' })
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  @IsString({ message: 'El teléfono debe ser texto' })
  @MaxLength(25, { message: 'El teléfono no debe exceder los 25 caracteres' })
  readonly telefono: string;

  @ApiProperty({ example: 'juan.perez@gmail.com' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  @IsEmail({}, { message: 'El formato del correo electrónico no es válido' })
  @MaxLength(150, { message: 'El correo no debe exceder los 150 caracteres' })
  readonly email: string;
}