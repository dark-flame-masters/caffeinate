import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/users.schema';
import { SurveyService } from './survey.service';
import { SurveyResolver } from './survey.resolver';
import { Survey, SurveySchema } from './survey.schema';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Survey.name, schema: SurveySchema },
      { name: User.name, schema: UserSchema },
    ]),
    UsersModule,
  ],
  providers: [SurveyService, SurveyResolver],
  exports: [SurveyService]
})
export class SurveyModule {}
