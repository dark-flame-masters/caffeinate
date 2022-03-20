import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from "src/users/users.schema";
import { UnauthorizedException } from '@nestjs/common';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}


  @Query(() => [User])
  findMany() {
    return this.usersService.findMany();
  }

  @Query(() => User, {nullable: true})
  findUserByName(@Args('username') username: string, @Context() context) {
    if(context.req.session === undefined || context.req.session.username != username) {throw new UnauthorizedException();}
    return this.usersService.findOne(username);
  }

}
