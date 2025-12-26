import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // 👈 Import

async function bootstrap() {
  // 👇 Tipo explícito
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Servir carpeta uploads
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads' });


  // CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const allowed =
        origin.startsWith('http://localhost') ||
        origin.endsWith('.vercel.app');

      if (allowed) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked: ${origin}`), false);
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Backend ejecutándose en: ${await app.getUrl()}`);
  console.log(`📁 Uploads servidos en: /uploads`);
  console.log(`🌐 CORS configurado para Vercel y desarrollo local`);

  const configService = app.get(ConfigService);
  console.log('JWT_SECRET:', configService.get<string>('JWT_SECRET'));
}

bootstrap();
