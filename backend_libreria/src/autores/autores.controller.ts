import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AutoresService } from './autores.service';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';
import { Autor } from './entities/autor.entity';

@ApiTags('autores') // 👈 Agrupa los endpoints bajo esta categoría en Swagger
@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo autor' })
  @ApiResponse({ status: 201, description: 'El autor ha sido creado exitosamente.', type: Autor })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createAutoreDto: CreateAutorDto) {
    return this.autoresService.create(createAutoreDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los autores con sus libros' })
  @ApiResponse({ status: 200, description: 'Lista de autores obtenida correctamente.', type: [Autor] })
  findAll() {
    return this.autoresService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un autor por su ID' })
  @ApiResponse({ status: 200, description: 'Autor encontrado.', type: Autor })
  @ApiResponse({ status: 404, description: 'Autor no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.autoresService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un autor existente' })
  @ApiResponse({ status: 200, description: 'Autor actualizado correctamente.', type: Autor })
  @ApiResponse({ status: 404, description: 'Autor no encontrado.' })
  update(@Param('id') id: string, @Body() updateAutoreDto: UpdateAutorDto) {
    return this.autoresService.update(+id, updateAutoreDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un autor' })
  @ApiResponse({ status: 200, description: 'Autor eliminado correctamente.' })
  @ApiResponse({ status: 404, description: 'Autor no encontrado.' })
  remove(@Param('id') id: string) {
    return this.autoresService.remove(+id);
  }
}