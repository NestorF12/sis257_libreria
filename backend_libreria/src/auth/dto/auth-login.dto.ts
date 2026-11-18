import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty({ message: 'El campo Email no debe ser vacío' })
  @IsEmail({}, { message: 'El formato del email es incorrecto' })
  email: string;

  @IsNotEmpty({ message: 'El campo Clave no debe ser vacío' })
  @IsString({ message: 'El campo Clave debe ser de tipo cadena' })
  clave: string;
}