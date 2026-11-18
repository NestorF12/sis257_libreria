import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuariosService } from '../usuarios/usuarios.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Usuario } from '../usuarios/entities/usuario.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(authLoginDto: AuthLoginDto): Promise<any> {
    const { email, clave } = authLoginDto;
    const usuarioOk = await this.usuarioService.validate(email, clave);

    const payload: JwtPayload = { sub: usuarioOk.id, email: usuarioOk.email, rol: usuarioOk.rol };
    const access_token = await this.getAccessToken(payload);

    return { usuario: usuarioOk, access_token };
  }

  async getAccessToken(payload: JwtPayload) {
    type StringValue = `${number}s` | `${number}m` | `${number}h`;
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_TOKEN ?? 'default_secret',
      expiresIn: (process.env.JWT_TOKEN_EXPIRATION as StringValue) || '60s',
    });
    return accessToken;
  }

  async verifyPayload(payload: JwtPayload): Promise<Usuario> {
    let usuario: Usuario;
    try {
      usuario = await this.usuarioService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException(`Usuario inválido: ${payload.sub}`);
    }
    return usuario;
  }
}