import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsuariosModule } from './usuarios/usuarios.module';
import { DetalleVentasModule } from './detalle_ventas/detalle_ventas.module';
import { AutoresModule } from './autores/autores.module';
import { VentasModule } from './ventas/ventas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { LibrosModule } from './libros/libros.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'proyecto_libreria',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsuariosModule,
    LibrosModule,
    CategoriasModule,
    VentasModule,
    AutoresModule,
    DetalleVentasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}