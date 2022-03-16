import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserInput } from './dto/login-user.input';
import * as bcrypt from 'bcrypt'
import { ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService){}

    async validateUser(username: string, password: string): Promise<any>{
        const user = await this.usersService.findOne(username);

        if(!user) return null;
        const valid = await bcrypt.compare(password, user?.password);
        
        if(user && valid){
            const {password, ...result } = user;
            return result;
        }

        return null; // this means not authenticated user or user DNE
    }

    async login(loginUserInput: LoginUserInput){
        const user = await this.usersService.findOne(loginUserInput.username);

        const {password, ...result } = user;
        
        return {
            //access_token: 'jwt',
            user: result,
        };
    }

    async signup(loginUserInput: LoginUserInput){
        const user = await this.usersService.findOne(loginUserInput.username);
        if(user){
            throw new Error('User already exists');
        }

        //hash
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(loginUserInput.password, salt);
        return await this.usersService.createUser({...loginUserInput,password,});
    }

    async logout(context){
        //login user input is to test in playground
        //should be "include" for request credentials
        context.req.session.destroy();
        if(context.req.session) return false;
        return true;
    }

}
