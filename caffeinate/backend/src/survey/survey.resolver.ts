import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { CreateSurveyInput, FindSurveyInput, Survey } from './survey.schema';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateSurveyResponse } from 'src/auth/dto/create-survey-response';


@Resolver()
export class SurveyResolver {
    constructor(private readonly surveyService: SurveyService, private readonly usersService: UsersService) {}

  @Query(() => [Survey])
  async findSurveyByAuthor(@Args('input') author : string, @Context() context) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}
    return await this.surveyService.findSurveyByAuthor(author);
  }

  @Query(() => Survey, {nullable: true})
  async findSurveyByAuthorIndex(@Args('input') { author, index }: FindSurveyInput, @Context() context) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}
    return await this.surveyService.findSurveyByAuthorIndex(author, index);
  }

  @Mutation(() => CreateSurveyResponse)
  async createSurvey(@Args('input') survey: CreateSurveyInput, @Context() context) {
    if(context.req.session === undefined || context.req.session.username != survey.author) {throw new UnauthorizedException();}
    return{
      user: await this.usersService.updateSurveyCount(survey.author, 1),
      survey: await this.surveyService.createSurvey({...survey})
    }
  }
}
