import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Journal, JournalDocument } from './journal.schema';


@Injectable()
export class JournalService {
    journals: Partial<Journal>[];
    constructor(
        @InjectModel(Journal.name) private journalModel: Model<JournalDocument>,
      ) {
          //this.journals = journals;
      }
     
      async findJournalByAuthorIndex(username, idx) {
        return await this.journalModel.find({ author: username }).sort({date: -1}).skip(idx).limit(1).findOne();
      }

      /*async findById(id) {
        return await this.journalModel.findById(id).lean();
      }*/

      async findJournalByAuthor(username) {
        return await this.journalModel.find({ author: username }).sort({date: -1}).lean();
      } 

      async findMany() {
        return await this.journalModel.find().lean();
      }
    
      async createJournal(input) {
        let newJournal = await this.journalModel.create(input);
        newJournal.date = new Date();
        await newJournal.save();
        return newJournal;
      }
}
