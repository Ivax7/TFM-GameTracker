import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
  console.log(`🌐 CORS configurado para Vercel y desarrollo local`);
}
bootstrap();