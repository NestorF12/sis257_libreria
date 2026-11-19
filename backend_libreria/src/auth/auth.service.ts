import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    private configService: ConfigService,
  ) {}

  async login(authLoginDto: AuthLoginDto) {
    const { email, clave } = authLoginDto;
    const usuarioOk = await this.usuarioService.validate(email, clave);

    if (!usuarioOk) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload: JwtPayload = {
      sub: usuarioOk.id,
      email: usuarioOk.email,
      rol: usuarioOk.rol,
    };

    const access_token = await this.getAccessToken(payload);

    return { usuario: usuarioOk, access_token };
  }

  async getAccessToken(payload: JwtPayload): Promise<string> {
    type StringValue = `${number}s` | `${number}m` | `${number}h` | `${number}d`;
    const expiration =
      (this.configService.get<string>('JWT_TOKEN_EXPIRATION') as StringValue) ||
      '600s';
    const secret =
      this.configService.get<string>('JWT_SECRET') || 'secreto_super_seguro';

    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiration,
    });
  }

  async verifyPayload(payload: JwtPayload): Promise<Usuario> {
    try {
      return await this.usuarioService.findOne(payload.sub);
    } catch {
      throw new UnauthorizedException(`Usuario inválido: ${payload.sub}`);
    }
  }
}