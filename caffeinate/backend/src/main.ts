import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import {
  ArgumentsHost,
  Catch,
} from '@nestjs/common';
import { ApolloError } from 'apollo-server-errors';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { ThrottlerException } from '@nestjs/throttler';

// @Catch(ThrottlerException)
// class ThrottlerExceptionFilter implements GqlExceptionFilter {
//   catch(exception: ThrottlerException, host: ArgumentsHost) {
//     throw new ApolloError(exception.message, 'FORBIDDEN')
//   }
// }


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser(process.env.COOKIE_SECRET));
  app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new ThrottlerExceptionFilter())
  app.setGlobalPrefix('api', { exclude: [{ path: 'graphql', method: RequestMethod.POST }] });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
