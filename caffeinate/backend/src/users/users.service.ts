import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User, UserDocument } from './users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
 

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}
  


  async findById(id) {
    return await this.userModel.findById(id).lean();
  }
  async findOne(username) {
    return await this.userModel.findOne({ username: username }).lean();
  } 
  async findMany() {
    return await this.userModel.find().lean();
  }

  async createUser(input) {
<<<<<<< HEAD
    return await this.userModel.create(input);
=======
    let newUser = await this.userModel.create(input);
    newUser.treeDate = new Date();
    newUser.treeStatus = 0;
    await newUser.save();
    return newUser;
  }

  async updateStatus(username, amount) {
    let user = await this.userModel.findOneAndUpdate({ username: username }, {$inc : {treeStatus : amount}}).lean();
    return user;
  }

  async updateTreeDate(username, newDate) {
    let user = await this.userModel.findOneAndUpdate({ username: username }, {treeDate : newDate}).lean();
    return user;
>>>>>>> origin/userAuthenticationBE
  }
}
