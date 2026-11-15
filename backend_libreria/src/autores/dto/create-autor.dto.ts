import { 
    IsNotEmpty, 
    IsString, 
    IsOptional, 
    MaxLength 
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAutorDto {
  @ApiProperty({ 
    description: 'Nombre del autor', 
    example: 'Gabriel' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El nombre del autor es obligatorio' })
  @MaxLength(100)
  nombre: string;

  @ApiProperty({ 
    description: 'Apellido del autor', 
    example: 'García Márquez' 
  })
  @IsString()
  @IsNotEmpty({ message: 'El apellido del autor es obligatorio' })
  @MaxLength(100)
  apellido: string;

  @ApiProperty({ 
    description: 'Nacionalidad del autor', 
    example: 'Colombiana',
    required: false 
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  nacionalidad?: string;
}