import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as fs from 'fs'
import { RequestMethod } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const httpsKey = fs.readFileSync(process.env.HTTPS_PRIVATE_KEY_RELDIR);
  const httpsCert = fs.readFileSync(process.env.HTTPS_CERTIFICATE_RELDIR);
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: httpsKey, cert: httpsCert
    }
  });

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

  app.setGlobalPrefix('api', { exclude: [{ path: 'graphql', method: RequestMethod.POST }] })

  await app.listen(process.env.PORT || 3000)
}
bootstrap();
