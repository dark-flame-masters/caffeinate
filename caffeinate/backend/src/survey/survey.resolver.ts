import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { CreateSurveyInput, FindSurveyInput, Survey } from './survey.schema';


@Resolver()
export class SurveyResolver {
    constructor(private readonly surveyService: SurveyService) {}

  @Query(() => [Survey])
  async findSurveyByAuthor(@Args('input') author : string) {
    return await this.surveyService.findSurveyByAuthor(author);
  }

  @Query(() => Survey)
  async findSurveyByAuthorIndex(@Args('input') { author, index }: FindSurveyInput) {
    return await this.surveyService.findSurveyByAuthorIndex(author, index);
  }

  @Mutation(() => Survey)
  async createSurvey(@Args('input') survey: CreateSurveyInput) {
    return await this.surveyService.createSurvey({...survey});
  }
}
