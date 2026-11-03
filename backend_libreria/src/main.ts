import { NestFactory } from '@nestjs/core';
import { AppModule} from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  //Swagger
  const config = new DocumentBuilder()
    .setTitle('Api Rest Liberiía - SIS257')
    .setDescription('API Rest para la gestión completa de la libreía, autores, categoría y ventas.')
    .setVersion('1.0')
    .addTag('libros')
    .addTag('autores')
    .addTag('categorias')
    .addTag('usuarios')
    .addTag('ventas')
    .addTag('detalle-ventas')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', in: 'header' }, 'access-token')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);  
  await app.listen(process.env.PORT ?? 3000);

console.log(`📚 ¡Librería abierta! Pase a comprar sus libros en: ${await app.getUrl()}/api/v1`);
}
bootstrap();
