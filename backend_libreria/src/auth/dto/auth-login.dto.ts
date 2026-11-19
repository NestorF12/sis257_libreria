import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthLoginDto {
  @ApiProperty({
    example: 'admin@gmail.com',
    description: 'Correo electrónico del usuario',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'tu_password',
    description: 'Contraseña del usuario',
  })
  @IsString()
  @MinLength(6)
  clave: string;
}