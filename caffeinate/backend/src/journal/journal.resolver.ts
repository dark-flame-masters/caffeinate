import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { JournalService } from './journal.service';
import {  Journal } from './journal.schema';
import { UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateJournalResponse } from 'src/auth/dto/create-journal-response';
import { WordDictionaryResponse } from 'src/users/users.schema';
import { GoogleUserInfo, UserInfo } from 'src/auth/user-info.param';
import { GoogleAuthGuard } from 'src/auth/google.guard';

@Resolver()
export class JournalResolver {
    constructor(private readonly journalService: JournalService, private readonly usersService: UsersService) {}

  @Query(() => [Journal])
  @UseGuards(GoogleAuthGuard)
  async findJournalByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    return await this.journalService.findJournalByAuthor(userInfo.googleId);
  }

  @Query(() => Journal, {nullable: true})
  @UseGuards(GoogleAuthGuard)
  async findJournalByAuthorIndex(@Args('index') index: number, @GoogleUserInfo() userInfo: UserInfo) {
    return await this.journalService.findJournalByAuthorIndex(userInfo.googleId, index);
  }

  @Query(() => [WordDictionaryResponse])
  @UseGuards(GoogleAuthGuard)
  async findJournalDictByAuthor(@GoogleUserInfo() userInfo: UserInfo) {
    // find the target content from all the journals of the user and store then in an array
    return await this.usersService.findUserDict(userInfo.googleId);

  }


  @Mutation(() => CreateJournalResponse)
  @UseGuards(GoogleAuthGuard)
  async createJournal(@Args('content') content: string, @GoogleUserInfo() userInfo: UserInfo) {
    return{
      user: await this.usersService.updateJournalCount(userInfo.googleId, 1),
      journal: await this.journalService.createJournal({content, authorGoogleId: userInfo.googleId})
    }
  }

}
