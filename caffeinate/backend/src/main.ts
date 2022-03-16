import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { RequestMethod } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.setGlobalPrefix('api', { exclude: [{ path: 'graphql', method: RequestMethod.POST }] })
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
