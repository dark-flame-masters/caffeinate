import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { User, UserDocument } from './users/users.schema';
import { LoginUserInput } from './auth/dto/login-user.input';
import { copyFileSync } from 'fs';
import { CreateJournalInput } from './journal/journal.schema';
import { JournalService } from './journal/journal.service';
import { SurveyService } from './survey/survey.service';
import { CreateSurveyInput } from './survey/survey.schema';


@Controller()
export class AppController {
  constructor(private readonly appService: AuthService, private readonly journalService: JournalService, 
    private readonly surveyService: SurveyService) {}

}
