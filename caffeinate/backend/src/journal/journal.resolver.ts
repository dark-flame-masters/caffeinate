import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JournalService } from './journal.service';
import { CreateJournalInput, FindJournalInput, Journal } from './journal.schema';

@Resolver()
export class JournalResolver {
    constructor(private readonly journalService: JournalService) {}

  @Query(() => [Journal])
  findMany() {
    return this.journalService.findMany();
  }

  @Query(() => [Journal])
  async findJournalByAuthor(@Args('input') author : string) {
    return await this.journalService.findJournalByAuthor(author);
  }

  @Query(() => Journal)
  async findJournalByAuthorIndex(@Args('input') { author, index }: FindJournalInput) {
    return await this.journalService.findJournalByAuthorIndex(author, index);
  }

  /*@Query(() => Journal, { name: 'journal' })
  findById(@Args('input') { _id }: FindJournalInput) {
    return this.journalService.findById(_id);
  }*/

  @Mutation(() => Journal)
  async createJournal(@Args('input') journal: CreateJournalInput) {
    return await this.journalService.createJournal({...journal});
  }

}
