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
     
    
      //TODO: find prev find next
      async findByAuthorIndex(username, idx) {
        return await this.journalModel.find({ author: username }).sort({create_at: -1}).limit(1).skip(idx);
      }

      async findById(id) {
        return await this.journalModel.findById(id).lean();
      }
      async findByAuthor(username) {
        return await this.journalModel.find({ author: username }).lean();
      } 
      async findMany() {
        return await this.journalModel.find().lean();
      }
    
      async createJournal(input) {
          console.log(input);
        return await this.journalModel.create(input);
      }
}
