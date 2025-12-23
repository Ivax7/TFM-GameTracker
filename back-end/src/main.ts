// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // URLs permitidas para CORS
  const allowedOrigins = [
    'http://localhost:4200', // desarrollo local Angular
    'https://tfm-game-tracker-pnxtkplkw-xavis-projects-379e9d0e.vercel.app' // frontend deployado en Vercel
  ];

  // Configuración de CORS
  app.enableCors({
    origin: (origin, callback) => {
      // Permite solicitudes sin origen (por ejemplo Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: origin not allowed'));
      }
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true, // necesario para cookies o tokens en headers
  });

  // Servir uploads (perfil)
  app.useStaticAssets(join(__dirname, '..', 'uploads/profile'), {
    prefix: '/uploads/',
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend corriendo en puerto ${port}`);
}
bootstrap();
