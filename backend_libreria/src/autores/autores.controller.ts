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
import { AutoresService } from './autores.service';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('autores')
@ApiBearerAuth()
@Controller('autores')
export class AutoresController {
  constructor(private readonly autoresService: AutoresService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.autoresService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.autoresService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  @Post()
  create(@Body() createAutorDto: CreateAutorDto) {
    return this.autoresService.create(createAutorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAutorDto: UpdateAutorDto,
  ) {
    return this.autoresService.update(id, updateAutorDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('vendedor')
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.autoresService.remove(id);
  }
}