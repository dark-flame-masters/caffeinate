import { forwardRef, Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from 'src/users/users.module';
import { SurveyModule } from 'src/survey/survey.module';
import { GoogleAuthGuard } from './google.guard';

@Global()
@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(()=>SurveyModule)],
  providers: [AuthService, AuthResolver, GoogleAuthGuard],
  exports: [AuthService]
})
export class AuthModule {}