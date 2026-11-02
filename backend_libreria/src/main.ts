import { NestFactory } from '@nestjs/core';
import { AppModule} from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);

console.log(`📚 ¡Librería abierta! Pase a comprar sus libros en: ${await app.getUrl()}/api/v1`);
}
bootstrap();
