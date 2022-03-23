import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { Journal, JournalDocument } from './journal.schema';


@Injectable()
export class JournalService {
    constructor(@InjectModel(Journal.name) private journalModel: Model<JournalDocument>) {}
     
      async findJournalByAuthorIndex(username: string, idx: number) {
        return await this.journalModel.find({ author: username }).sort({date: -1}).skip(idx).limit(1).findOne();
      }

      async findJournalByAuthor(username: string) {
        return await this.journalModel.find({ author: username }).sort({date: -1}).lean();
      } 

      async findMany() {
        return await this.journalModel.find().lean();
      }

      async findJournalContent(username: string) {
        return await this.journalModel.find({ author: username },{content: 1}).lean();
      }
    
      async createJournal(input: { content: string; author: string; }) {
        let newJournal = await this.journalModel.create(input);
        newJournal.date = new Date();
        await newJournal.save();
        return newJournal;
      }
}
