import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LibrosService } from './libros.service';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // ajusta la ruta si difiere
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('libros')
@ApiBearerAuth()
@Controller('libros')
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}

  // Público: permite mostrar los libros en Home sin iniciar sesión
  @Get()
  findAll() {
    return this.librosService.findAll();
  }

  // Público: permite consultar un libro por ID si se requiere
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.findOne(id);
  }

  // Exclusivo para "vendedor"
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  @Post()
  create(@Body() createLibroDto: CreateLibroDto) {
    return this.librosService.create(createLibroDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLibroDto: UpdateLibroDto,
  ) {
    return this.librosService.update(id, updateLibroDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.librosService.remove(id);
  }
}