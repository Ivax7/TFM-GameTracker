import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: (origin, callback) => {
      // 1. Permitir peticiones sin origin (Postman, curl, servidor a servidor)
      if (!origin) {
        return callback(null, true);
      }

      // 2. Lista de orígenes explícitamente permitidos
      const allowedOrigins = [
        'http://localhost:4200',      // Angular local
        'http://localhost:3000',      // React/Vue local
        'http://localhost:5173',      // Vite dev server
        'https://tfm-game-tracker.vercel.app', // Tu dominio principal si lo tienes
      ];

      // 3. Permitir cualquier subdominio de vercel.app (para preview deployments)
      const isVercelPreview = origin.includes('.vercel.app');
      
      // 4. Permitir cualquier dominio de GitHub Codespaces si usas
      const isCodespaces = origin.includes('.github.dev');
      
      // 5. En desarrollo, también permitir el origen exacto que viene
      const isDevelopment = process.env.NODE_ENV !== 'production';

      if (allowedOrigins.includes(origin) || isVercelPreview) {
        callback(null, true);
      } 
      // Opcional: En desarrollo, ser más permisivo
      else if (isDevelopment) {
        console.log(`⚠️  Desarrollo: Permitiendo origen no listado: ${origin}`);
        callback(null, true);
      }
      else {
        console.error(`🚫 CORS bloqueado: ${origin}`);
        callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true, // Importante para cookies/auth
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Accept', 
      'X-Requested-With',
      'Access-Control-Allow-Headers',
      'Origin'
    ],
    exposedHeaders: ['Authorization', 'Content-Length'],
    maxAge: 86400, // 24 horas de cache para preflight
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 Backend ejecutándose en: ${await app.getUrl()}`);
  console.log(`🌐 CORS configurado para Vercel y desarrollo local`);
}
bootstrap();