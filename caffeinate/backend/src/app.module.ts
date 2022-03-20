import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { JournalModule } from './journal/journal.module';
import { SurveyModule } from './survey/survey.module';


@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: 'mongodb://localhost:27017/nest',
      }),
    }),

    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      driver: ApolloDriver,
      outputAs: 'class',
    }),
    UsersModule,
    AuthModule,
    JournalModule,
    SurveyModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
