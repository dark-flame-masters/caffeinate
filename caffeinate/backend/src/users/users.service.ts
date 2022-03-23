import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
 

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  


  async findById(id: any) {
    return await this.userModel.findById(id).lean();
  }
  async findOne(username: string) {
    return await this.userModel.findOne({ username: username }).lean();
  } 
  async findMany() {
    return await this.userModel.find().lean();
  }

  async createUser(input: { password: string; username: string; }) {
    let newUser = await this.userModel.create(input);
    newUser.treeDate = new Date();
    newUser.treeStatus = 0;
    newUser.journalCount = 0;
    newUser.surveyCount = 0;
    await newUser.save();
    return newUser;
  }

  async updateStatus(username: string, amount: number) {
    let user = await this.userModel.findOneAndUpdate({ username: username }, {$inc : {treeStatus : amount}}).lean();
    return user;
  }

  async updateTreeDate(username: string, newDate: number) {
    let user = await this.userModel.findOneAndUpdate({ username: username }, {treeDate : newDate}).lean();
    return user;
  }

  async updateJournalCount(username: string, count: number) {
    // increase the journal count by param count
    let user = await this.userModel.findOneAndUpdate({ username: username }, {$inc : {journalCount : count}}).lean();
    return {...user, journalCount: user.journalCount+1};
  }

  async updateSurveyCount(username: string, count: number) {
    // increase the journal count by param count
    let user = await this.userModel.findOneAndUpdate({ username: username }, {$inc : {surveyCount : count}}).lean();
    return {...user, surveyCount: user.surveyCount+1};
  }
}
