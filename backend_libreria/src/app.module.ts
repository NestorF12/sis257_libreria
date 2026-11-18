import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DetalleVentasModule } from './detalle_ventas/detalle_ventas.module';
import { AutoresModule } from './autores/autores.module';
import { VentasModule } from './ventas/ventas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { LibrosModule } from './libros/libros.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // 1. Cargamos el archivo .env de forma global
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Configuramos TypeORM leyendo de tu .env (usando DB_USER tal como lo definiste)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number.parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // (Recuerda cambiar a false en producción)
    }),

    // 3. Todos los módulos de tu librería intactos
    UsuariosModule,
    LibrosModule,
    CategoriasModule,
    VentasModule,
    AutoresModule,
    DetalleVentasModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}