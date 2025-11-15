// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: true });

  // public uploads file
  app.useStaticAssets(join(__dirname, '..', 'uploads/profile'), {
    prefix: '/uploads/',
  });

  await app.listen(3000);
}
bootstrap();
