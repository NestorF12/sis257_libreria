import { PartialType } from '@nestjs/swagger'; // Importado desde Swagger
import { CreateAutorDto } from './create-autor.dto';

export class UpdateAutorDto extends PartialType(CreateAutorDto) {}