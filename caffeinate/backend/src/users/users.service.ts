import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';
import { UserInfo } from 'src/auth/user-info.param';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  
  async findOne(googleId: string) {
    return await this.userModel.findOne({ googleId }).lean();
  }

  async createUser(userInfo: UserInfo) {
    let newUser = await this.userModel.create(userInfo);
    newUser.treeDate = new Date();
    newUser.treeStatus = 0;
    newUser.journalCount = 0;
    newUser.surveyCount = 0;
    newUser.todoCount = 0;
    newUser.journalDict = JSON.stringify({});
    await newUser.save();
    return newUser;
  }


  async findUserDict(googleId: string) {
    let user = await this.userModel.findOne({ googleId }).lean();
    let dict = JSON.parse(user.journalDict); 

    let result = [];
    // we loop over the dict and convert the format
    Object.keys(dict).forEach(function(key) {
      //convert then to one object
      let obj = {
        text: key.toString(),
        value: dict[key],
      }
      result.push(obj);
    });

    return result;

  }

  async updateStatus(googleId: string, amount: number) {
    let user = await this.userModel.findOneAndUpdate({ googleId }, {$inc : {treeStatus : amount}}).lean();
    return user;
  }

  async updateTreeDate(googleId: string, newDate: number) {
    let user = await this.userModel.findOneAndUpdate({ googleId }, {treeDate : newDate}).lean();
    return user;
  }

  async updateJournalCount(googleId: string, count: number) {
    // increase the journal count by param count
    let user = await this.userModel.findOneAndUpdate({ googleId }, {$inc : {journalCount : count}}).lean();
    return {...user, journalCount: user.journalCount+count};
  }

  async updateSurveyCount(googleId: string, count: number) {
    // increase the journal count by param count
    let user = await this.userModel.findOneAndUpdate({ googleId }, {$inc : {surveyCount : count}}).lean();
    return {...user, surveyCount: user.surveyCount+count};
  }

  async updateJournalDict(googleId: string, newDict: string) {
    let user = await this.userModel.findOneAndUpdate({ googleId }, {journalDict : newDict}).lean();
    return {...user, journalDict: newDict};
  }
}
