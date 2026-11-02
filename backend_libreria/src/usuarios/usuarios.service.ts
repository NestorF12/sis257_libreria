import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly repositorioUsuario: Repository<Usuario>,
  ) {}

  // CREATE: Crear un nuevo usuario
  async create(createUsuarioDto: CreateUsuarioDto) {
    const nuevoUsuario = this.repositorioUsuario.create(createUsuarioDto);
    return await this.repositorioUsuario.save(nuevoUsuario);
  }

  // READ: Listar todos los usuarios
  async findAll() {
    return await this.repositorioUsuario.find();
  }

  // READ: Buscar un usuario por ID
  async findOne(id: number) {
    const usuario = await this.repositorioUsuario.findOneBy({ id });
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
    return usuario;
  }

  // UPDATE: Actualizar un usuario
  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.findOne(id);
    this.repositorioUsuario.merge(usuario, updateUsuarioDto);
    return await this.repositorioUsuario.save(usuario);
  }

  // DELETE: Eliminar un usuario
  async remove(id: number) {
    const usuario = await this.findOne(id);
    return await this.repositorioUsuario.remove(usuario);
  }
}