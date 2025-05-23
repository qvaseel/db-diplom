import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const PORT = process.env.PORT || 8000;
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: ['https://client-diplom.vercel.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));


  await app.listen(PORT, () => console.log(`Server has been started on port ${PORT}`))
}
bootstrap();
