import { NotImplementedException, UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginResponse } from './dto/login-response';
import { GoogleAuthGuard } from './google.guard';
import { GoogleUserInfo, UserInfo } from './user-info.param';

@Resolver()
export class AuthResolver {
    constructor(private authService: AuthService) {}

    @Mutation(() => LoginResponse)  //(post: req res)
    @UseGuards(GoogleAuthGuard)
    public async login(@GoogleUserInfo() userInfo: UserInfo){
        return await this.authService.login(userInfo);
    }

    // todo: complete
    @Mutation(() => Boolean)  
    public async logout() {
        throw new NotImplementedException();
    }
}
