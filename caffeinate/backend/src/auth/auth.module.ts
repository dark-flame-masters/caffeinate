import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { SurveyModule } from 'src/survey/survey.module';

@Module({
  imports: [PassportModule, UsersModule, SurveyModule],
  providers: [AuthService, AuthResolver, LocalStrategy],
  exports: [AuthService]
})
export class AuthModule {}