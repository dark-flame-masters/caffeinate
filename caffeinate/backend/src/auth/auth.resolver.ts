import { Req, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
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
    login(@Args('loginUserInput') loginUserInput: LoginUserInput){
        return this.authService.login(loginUserInput);
    }

    @Mutation(() => User)  
    signup(@Args('loginUserInput') loginUserInput: LoginUserInput){
        return this.authService.signup(loginUserInput);
    }

    @Mutation(() => Boolean)  
    logout(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context() context){
        //login user input is to test in playground
        context.req.session.destroy();
        if(context.req.session) return false;
        return true;
    }
}
