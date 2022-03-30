import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { CreateSurveyInput, Survey } from './survey.schema';
import { UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateSurveyResponse } from 'src/auth/dto/create-survey-response';
import { GoogleAuthGuard } from 'src/auth/google.guard';
import { GoogleUserInfo, UserInfo } from 'src/auth/user-info.param';


@Resolver()
export class SurveyResolver {
    constructor(private readonly surveyService: SurveyService, private readonly usersService: UsersService) {}

  @Query(() => [Survey])
  @UseGuards(GoogleAuthGuard)
  async findSurveyByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    return await this.surveyService.findSurveyByAuthor(userInfo.googleId);
  }

  @Query(() => Survey, {nullable: true})
  @UseGuards(GoogleAuthGuard)
  async findSurveyByAuthorIndex(@Args('index') index: number, @GoogleUserInfo() userInfo: UserInfo) {
    return await this.surveyService.findSurveyByAuthorIndex(userInfo.googleId, index);
  }

  @Mutation(() => CreateSurveyResponse)
  @UseGuards(GoogleAuthGuard)
  async createSurvey(@Args('input') survey: CreateSurveyInput, @GoogleUserInfo() userInfo: UserInfo) {
    return{
      user: await this.usersService.updateSurveyCount(userInfo.googleId, 1),
      survey: await this.surveyService.createSurvey({...survey, authorGoogleId: userInfo.googleId})
    }
  }

  @Query(() => [Survey])
  @UseGuards(GoogleAuthGuard)
  async find30RatesByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    return await this.surveyService.find30ratesByAuthor(userInfo.googleId);
  }
}
