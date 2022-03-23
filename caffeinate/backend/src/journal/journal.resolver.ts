import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { JournalService } from './journal.service';
import { CreateJournalInput, FindJournalInput, Journal } from './journal.schema';
import { UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { CreateJournalResponse } from 'src/auth/dto/create-journal-response';

@Resolver()
export class JournalResolver {
    constructor(private readonly journalService: JournalService, private readonly usersService: UsersService) {}

  @Query(() => [Journal])
  findMany() {
    return this.journalService.findMany();
  }

  @Query(() => [Journal])
  async findJournalByAuthor(@Args('input') author : string, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}
    return await this.journalService.findJournalByAuthor(author);
  }

  @Query(() => Journal, {nullable: true})
  async findJournalByAuthorIndex(@Args('input') { author, index }: FindJournalInput, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}
    return await this.journalService.findJournalByAuthorIndex(author, index);
  }

  @Query(() => [String])
  async findJournalWordByAuthor(@Args('input') author : string, @Context() context: { req: { session: { username: string; }; }; }) {
    if(context.req.session === undefined || context.req.session.username != author) {throw new UnauthorizedException();}

    // find the target content from all the journals of the user and store then in an array
    let contentLst = await this.journalService.findJournalContent(author);
    let stringLst = []
    for(let i = 0; i < contentLst.length; i++) {
      stringLst.push(contentLst[i].content);
    }
    //now we want to convert the string in the array to words
    let wordLst = [];
    for(let i = 0; i < stringLst.length; i++) {
      let tempArr = this.convertStringToWords(stringLst[i]);
      wordLst = wordLst.concat(tempArr);
    }
    return wordLst;
  }

  convertStringToWords(text: string){
    let alphaNumeric = text.replace(/[^A-Za-z0-9]+/g, " ");
    let wordArr = alphaNumeric.trim().split(" ");
    return wordArr;
  }


  @Mutation(() => CreateJournalResponse)
  async createJournal(@Args('input') journal: CreateJournalInput, @Context() context) {
    if(context.req.session === undefined || context.req.session.username != journal.author) {throw new UnauthorizedException();}
    return{
      user: await this.usersService.updateJournalCount(journal.author, 1),
      journal: await this.journalService.createJournal({...journal})
    }
  }

}
