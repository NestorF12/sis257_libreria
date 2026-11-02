import { 
    IsNotEmpty, 
    IsString, 
    IsOptional 
} from 'class-validator';

export class CreateAutorDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del autor es obligatorio' })
  nombre: string;

  @IsString()
  @IsOptional()
  nacionalidad?: string;
}