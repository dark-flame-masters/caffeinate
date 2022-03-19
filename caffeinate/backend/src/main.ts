import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import express from 'express';
import cors from 'cors';
import {graphqlHTTP} from 'express-graphql';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //session here
  // somewhere in your initialization file
  app.use(
    session({
      secret: 'my-secret',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(3000);

}
bootstrap();
