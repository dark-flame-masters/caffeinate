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
    return this.userModel.findById(id).lean();
  }
  async findOne(username) {
    return await this.userModel.findOne({ username: username }).lean();
  } 
  async findMany() {
    return this.userModel.find().lean();
  }

  async createUser(input) {
    return this.userModel.create(input);
  }
}
