import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('mandadito'); // Prefijo global para rutas
  app.enableCors(); // Habilita CORS para peticiones externas

  const PORT = process.env.PORT || 3000;
  await app.listen(PORT);

  Logger.log(`🚀 Servidor corriendo en: http://localhost:${PORT}/mandadito`);
}
bootstrap();
