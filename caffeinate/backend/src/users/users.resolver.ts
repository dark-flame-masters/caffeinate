import { Resolver, Query } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from "src/users/users.schema";
import { UseGuards } from '@nestjs/common';
import { GoogleUserInfo, UserInfo } from 'src/auth/user-info.param';
import { GoogleAuthGuard } from 'src/auth/google.guard';
import { ThrottlerProxyGQLGuard } from 'src/throttle/throttler-proxy-gql.guard';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, {nullable: true})
  @UseGuards(GoogleAuthGuard)
  @UseGuards(ThrottlerProxyGQLGuard)
  findUserByName(@GoogleUserInfo() userInfo: UserInfo) {
    return this.usersService.findOne(userInfo.googleId);
  }

}
