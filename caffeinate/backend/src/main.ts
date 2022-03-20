import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import { RequestMethod } from '@nestjs/common';
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
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );
  app.setGlobalPrefix('api', { exclude: [{ path: 'graphql', method: RequestMethod.POST }] })
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
