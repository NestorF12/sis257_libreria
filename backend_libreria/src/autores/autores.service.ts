import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Autor } from './entities/autor.entity';
import { CreateAutorDto } from './dto/create-autor.dto';
import { UpdateAutorDto } from './dto/update-autore.dto';

@Injectable()
export class AutoresService {
  constructor(
    @InjectRepository(Autor)
    private readonly autorRepository: Repository<Autor>,
  ) {}

  async create(createAutorDto: CreateAutorDto) {
    const nuevoAutor = this.autorRepository.create(createAutorDto);
    return await this.autorRepository.save(nuevoAutor);
  }

  async findAll() {
    return await this.autorRepository.find();
  }

  async findOne(id: number) {
    const autor = await this.autorRepository.findOneBy({ id });
    if (!autor) {
      throw new NotFoundException(`Autor con ID ${id} no encontrado`);
    }
    return autor;
  }

  async update(id: number, updateAutorDto: UpdateAutorDto) {
    const autor = await this.findOne(id);
    this.autorRepository.merge(autor, updateAutorDto);
    return await this.autorRepository.save(autor);
  }

  async remove(id: number) {
    const autor = await this.findOne(id);
    return await this.autorRepository.remove(autor);
  }
}