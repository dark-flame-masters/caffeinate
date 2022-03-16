import { Controller, Get, Post, Body } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { User, UserDocument } from './users/users.schema';
import { LoginUserInput } from './auth/dto/login-user.input';
import { copyFileSync } from 'fs';


@Controller()
export class AppController {
  constructor(private readonly appService: AuthService) {}

  @Post('signup') // endpoint
  signupUser(@Body() input: LoginUserInput) { // the kind of input the user inputs
    return this.appService.signup(input); // call the right function from x.service
  }

  @Post('signin') // endpoint
  signinUser(@Body() input: LoginUserInput) { 
    return this.appService.login(input); 
  }
}
