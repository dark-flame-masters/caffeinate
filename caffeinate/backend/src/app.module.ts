import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ApolloDriver } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JournalModule } from './journal/journal.module';
import { SurveyModule } from './survey/survey.module';
import { TodoModule } from './todo/todo.module';
import { ScheduleModule } from '@nestjs/schedule';
import { NotifierService } from './notifier/notifier.service';
import { NotifierModule } from './notifier/notifier.module';



@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
      outputAs: 'class',
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    AuthModule,
    JournalModule,
    SurveyModule,
    TodoModule,
    NotifierModule
  ],
  providers: [NotifierService],
})
export class AppModule { }