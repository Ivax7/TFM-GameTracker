// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:4200', // tu frontend local
    'https://tfm-game-tracker-cjp8z7bem-xavis-projects-379e9d0e.vercel.app/', // tu frontend en Vercel
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Permite peticiones sin origin (Postman, backend, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy: origin not allowed'));
      }
    },
    credentials: true, // permite cookies y autenticación
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
