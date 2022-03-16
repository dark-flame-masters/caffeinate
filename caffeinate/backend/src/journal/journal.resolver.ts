import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { JournalService } from './journal.service';
import { CreateJournalInput, FindJournalInput, Journal } from './journal.schema';

@Resolver()
export class JournalResolver {
    constructor(private readonly journalService: JournalService) {}

  @Query(() => [Journal], { name: 'journal' })
  findMany() {
    return this.journalService.findMany();
  }

  @Query(() => Journal, { name: 'journal' })
  findByAuthor(@Args('input') { author }: FindJournalInput) {
    return this.journalService.findByAuthor(author);
  }

  @Query(() => Journal, { name: 'journal' })
  findByAuthorIndex(@Args('input') { author, index }: FindJournalInput) {
    return this.journalService.findByAuthorIndex(author, index);
  }

  @Query(() => Journal, { name: 'journal' })
  findById(@Args('input') { _id }: FindJournalInput) {
    return this.journalService.findById(_id);
  }

  @Mutation(() => Journal)
  async createJournal(@Args('input') journal: CreateJournalInput) {
    console.log(journal);
      console.log(await this.journalService.createJournal({...journal}));
    return await this.journalService.createJournal({...journal});
  }

}
