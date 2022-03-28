import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { RequestMethod } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //session here
  // somewhere in your initialization file
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());

  app.setGlobalPrefix('api', { exclude: [{ path: 'graphql', method: RequestMethod.POST }] });

  app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
