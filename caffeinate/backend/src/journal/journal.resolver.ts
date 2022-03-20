import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { JournalService } from './journal.service';
import { CreateJournalInput, FindJournalInput, Journal } from './journal.schema';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Resolver()
export class JournalResolver {
    constructor(private readonly journalService: JournalService, private readonly usersService: UsersService) {}

  @Query(() => [Journal])
  findMany() {
    return this.journalService.findMany();
  }

  @Query(() => [Journal])
  async findJournalByAuthor(@Args('input') author : string, @Context() context) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}
    return await this.journalService.findJournalByAuthor(author);
  }

  @Query(() => Journal, {nullable: true})
  async findJournalByAuthorIndex(@Args('input') { author, index }: FindJournalInput, @Context() context) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}
    return await this.journalService.findJournalByAuthorIndex(author, index);
  }


  @Mutation(() => Journal)
  async createJournal(@Args('input') journal: CreateJournalInput, @Context() context) {
    if(context.req.session === undefined || context.req.session.username != journal.author) {throw new UnauthorizedException();}
    await this.usersService.updateJournalCount(journal.author, 1);
    return await this.journalService.createJournal({...journal});
  }

}
