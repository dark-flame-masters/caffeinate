import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { CreateSurveyInput, Survey } from './survey.schema';
import { UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateSurveyResponse } from 'src/auth/dto/create-survey-response';
import { GoogleAuthGuard } from 'src/auth/google.guard';
import { GoogleUserInfo, UserInfo } from 'src/auth/user-info.param';
import { ThrottlerProxyGQLGuard } from 'src/throttle/throttler-proxy-gql.guard';


@Resolver()
export class SurveyResolver {
    constructor(private readonly surveyService: SurveyService, private readonly usersService: UsersService) {}

  @Query(() => [Survey])
  @UseGuards(GoogleAuthGuard)
  @UseGuards(ThrottlerProxyGQLGuard)
  async findSurveyByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    return await this.surveyService.findSurveyByAuthor(userInfo.googleId);
  }

  @Query(() => Survey, {nullable: true})
  @UseGuards(GoogleAuthGuard)
  @UseGuards(ThrottlerProxyGQLGuard)
  async findSurveyByAuthorIndex(@Args('index') index: number, @GoogleUserInfo() userInfo: UserInfo) {
    return await this.surveyService.findSurveyByAuthorIndex(userInfo.googleId, index);
  }

  @Mutation(() => CreateSurveyResponse)
  @UseGuards(GoogleAuthGuard)
  @UseGuards(ThrottlerProxyGQLGuard)
  async createSurvey(@Args('input') survey: CreateSurveyInput, @GoogleUserInfo() userInfo: UserInfo) {
    return{
      user: await this.usersService.updateSurveyCount(userInfo.googleId, 1),
      survey: await this.surveyService.createSurvey({...survey, authorGoogleId: userInfo.googleId})
    }
  }

  @Query(() => [Survey])
  @UseGuards(GoogleAuthGuard)
  @UseGuards(ThrottlerProxyGQLGuard)
  async find30RatesByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    return await this.surveyService.find30ratesByAuthor(userInfo.googleId);
  }
}
