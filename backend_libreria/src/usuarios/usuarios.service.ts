import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

  // CREATE: Crear un nuevo usuario (con validación de correo único)
  async create(createUsuarioDto: CreateUsuarioDto) {
    const { email } = createUsuarioDto;

    // 1. Verificar si el correo ya existe
    const correoExistente = await this.repositorioUsuario.findOneBy({ 
      email: email.trim() 
    });

    if (correoExistente) {
      throw new ConflictException(`El correo electrónico '${email}' ya se encuentra registrado.`);
    }

    // 2. Crear y guardar el nuevo usuario
    const nuevoUsuario = this.repositorioUsuario.create({
      ...createUsuarioDto,
      nombre: createUsuarioDto.nombre.trim(),
      telefono: createUsuarioDto.telefono.trim(),
      email: email.trim(),
    });

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