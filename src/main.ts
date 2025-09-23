import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 // Habilitar CORS
 app.enableCors({
  origin: 'http://localhost:9002', // o un array de orígenes
  credentials: true, // si usás cookies o headers de autenticación
});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
