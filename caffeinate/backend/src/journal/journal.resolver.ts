import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JournalService } from './journal.service';
import {  CreateJournalInput, CreateJournalResponse, Journal } from './journal.schema';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { WordDictionaryResponse } from 'src/users/users.schema';
import { GoogleUserInfo, UserInfo } from 'src/auth/user-info.param';
import { GoogleAuthGuard } from 'src/auth/google.guard';
import { validate } from 'class-validator';
import { ThrottlerProxyGQLGuard } from 'src/throttle/throttler-proxy-gql.guard';

@Resolver()
export class JournalResolver {
    constructor(private readonly journalService: JournalService, private readonly usersService: UsersService) {}

  @Query(() => Journal, {nullable: true})
  // @UseGuards(ThrottlerProxyGQLGuard)
  @UseGuards(GoogleAuthGuard)
  async findJournalByAuthorIndex(@Args('index') index: number, @GoogleUserInfo() userInfo: UserInfo) {
    return await this.journalService.findJournalByAuthorIndex(userInfo.googleId, index);
  }

  @Query(() => [WordDictionaryResponse])
  // @UseGuards(ThrottlerProxyGQLGuard)
  @UseGuards(GoogleAuthGuard)
  async findJournalDictByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    // find the target content from all the journals of the user and store then in an array
    return await this.usersService.findUserDict(userInfo.googleId);

  }


  @Mutation(() => CreateJournalResponse)
  // @UseGuards(ThrottlerProxyGQLGuard)
  @UseGuards(GoogleAuthGuard)
  async createJournal(@Args('content') content: string, @GoogleUserInfo() userInfo: UserInfo) {
    //manually validate by function and validate the entire input
    let createJournalInput = new CreateJournalInput()
    createJournalInput.authorGoogleId = userInfo.googleId;
    createJournalInput.content = content;

    const errors = await validate(createJournalInput)
    if (errors.length > 0){
        throw new BadRequestException();
    }
    else{
        return{
          user: await this.usersService.updateJournalCount(userInfo.googleId, 1),
          journal: await this.journalService.createJournal(createJournalInput)
        }
    }
    
  }

  @Query(() => [Number])
  // @UseGuards(ThrottlerProxyGQLGuard)
  @UseGuards(GoogleAuthGuard)
  async find30SentimentsByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    return await this.journalService.find30SentimentsByAuthor(userInfo.googleId);
  }

}
