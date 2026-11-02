import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Libro } from './entities/libro.entity';
import { CreateLibroDto } from './dto/create-libro.dto';
import { UpdateLibroDto } from './dto/update-libro.dto';

@Injectable()
export class LibrosService {
  constructor(
    @InjectRepository(Libro)
    private readonly libroRepository: Repository<Libro>,
  ) {}

  // CREATE: Registrar un nuevo libro
  async create(createLibroDto: CreateLibroDto) {
    const nuevoLibro = this.libroRepository.create(createLibroDto);
    return await this.libroRepository.save(nuevoLibro);
  }

  // READ: Listar todos los libros
  async findAll() {
    return await this.libroRepository.find();
  }

  // READ: Buscar un libro por su ID
  async findOne(id: number) {
    const libro = await this.libroRepository.findOneBy({ id });
    if (!libro) {
      throw new NotFoundException(`Libro con ID ${id} no encontrado`);
    }
    return libro;
  }

  // UPDATE: Actualizar un libro existente
  async update(id: number, updateLibroDto: UpdateLibroDto) {
    const libro = await this.findOne(id);
    this.libroRepository.merge(libro, updateLibroDto);
    return await this.libroRepository.save(libro);
  }

  // DELETE: Eliminar un libro
  async remove(id: number) {
    const libro = await this.findOne(id);
    return await this.libroRepository.remove(libro);
  }
}