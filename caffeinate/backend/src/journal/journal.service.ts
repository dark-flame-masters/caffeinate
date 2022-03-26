import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Journal, JournalDocument } from './journal.schema';


@Injectable()
export class JournalService {
    constructor(@InjectModel(Journal.name) private journalModel: Model<JournalDocument>, private usersService: UsersService) {}
     
      async findJournalByAuthorIndex(username: string, idx: number) {
        return await this.journalModel.find({ author: username }).sort({date: -1}).skip(idx).limit(1).findOne();
      }

      async findJournalByAuthor(username: string) {
        return await this.journalModel.find({ author: username }).sort({date: -1}).lean();
      } 

      async findMany() {
        return await this.journalModel.find().lean();
      }


      async createJournal(input: { content: string; author: string; }) {
        //we first create the journal and save the journal
        let newJournal = await this.journalModel.create(input);
        newJournal.date = new Date();
        await newJournal.save();

        //Then we convert the content to a list of single words
        let wordLst = this.convertStringToWords(input.content);

        // now we want to count the occurance of each item
        let user = await this.usersService.findOne(input.author);
        let wordCounts = JSON.parse(user.journalDict); // get the dictionary from user
        for (const item of wordLst) {
          wordCounts[item] = wordCounts[item] ? wordCounts[item] + 1 : 1;
        }
        // then we save the new dictionary to the user
        await this.usersService.updateJournalDict(input.author, JSON.stringify(wordCounts));
        //at last we return the journal
        return newJournal;
      }

      convertStringToWords(text: string){
        let alphaNumeric = text.toLowerCase().replace(/[^A-Za-z0-9]+/g, " ");
        let wordArr = alphaNumeric.trim().split(" ");
        return wordArr;
      }
}
