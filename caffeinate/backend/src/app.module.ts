import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService]
    }),
    ServeStaticModule.forRootAsync({
      useFactory: (configService: ConfigService) => ([{
        rootPath: join(__dirname, configService.get('FRONTEND_STATIC_RELDIR')),
      }]),
      inject: [ConfigService]
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(__dirname, './src/schema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
    }),
    UsersModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
