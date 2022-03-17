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

  @Post('signup') // endpoint
  signupUser(@Body() input: LoginUserInput) { // the kind of input the user inputs
    return this.appService.signup(input); // call the right function from x.service
  }

  @Post('signin') // endpoint
  signinUser(@Body() input: LoginUserInput) { 
    return this.appService.login(input); 
  }

  @Post('signout') // endpoint
  signoutUser(@Body() input: LoginUserInput) { 
    return this.appService.logout(input); 
  }

  @Post('journal') // endpoint
  createJournal(@Body() input: CreateJournalInput) { 
    return this.journalService.createJournal(input); 
  }

  @Post('survey') // endpoint
  createSurvey(@Body() input: CreateSurveyInput) {
    return this.surveyService.createSurvey(input); 
  }

  @Get('journal/:idx') // endpoint
  getJournalByAuthorIndex(req) { 
    return this.journalService.findJournalByAuthorIndex(req.session.username, req.params.idx); 
  }

  @Get('survey/:idx') // endpoint
  getSurveyByAuthorIndex(req) { //req.session.username
    return this.surveyService.findSurveyByAuthorIndex(req.session.username, req.params.idx); 
  }
}
