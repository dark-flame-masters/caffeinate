import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from "src/users/users.schema";
import { UnauthorizedException } from '@nestjs/common';
import { GoogleUserInfo, UserInfo } from 'src/auth/user-info.param';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, {nullable: true})
  findUserByName(@GoogleUserInfo() userInfo: UserInfo) {
    return this.usersService.findOne(userInfo.googleId);
  }

}
