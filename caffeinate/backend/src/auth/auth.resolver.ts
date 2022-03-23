import { ExecutionContext, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Args, Context, GqlExecutionContext, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/users.schema';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { LoginUserInput } from './dto/login-user.input';
import { GqlAuthGuard } from './gql-auth.guard';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => LoginResponse)  //(post: req res)
    @UseGuards(GqlAuthGuard)
    async login(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context: { req: { session: { username: string; }; }; }){
        return await this.authService.login(loginUserInput, context);
    }

    @Mutation(() => User)  
    signup(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context: { req: { session: { username: string; }; }; }){
        return this.authService.signup(loginUserInput, context);
    }

    @Mutation(() => Boolean)  
    logout(@Args('input') username : string, @Context() context) {
        if(context.req.session === undefined || context.req.session.username != username) {throw new UnauthorizedException();}
        return this.authService.logout(context);
    }
}
