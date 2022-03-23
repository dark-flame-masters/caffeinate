import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { LoginUserInput } from './dto/login-user.input';
import * as bcrypt from 'bcrypt'
import { SurveyService } from 'src/survey/survey.service';
import { User } from 'src/users/users.schema';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private surveyService: SurveyService){}

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

    async login(loginUserInput: LoginUserInput, context: { req: { session: { username: string; }; }; }){
        const user = await this.usersService.findOne(loginUserInput.username);

        const {password, ...result } = user;
        
        //set session
        context.req.session.username = loginUserInput.username;

        const dateDist = 600000; //600000 ms = 10 mins
        let newDate = new Date().valueOf();
        let lastDate = user.treeDate.valueOf();
        let updatedUser = result;
        if(newDate - lastDate >= dateDist){
            updatedUser = await this.checkUpdateTreeAndDate(user, lastDate, newDate);
        }
        return {
            user: updatedUser,
        };
        
    }

    async signup(loginUserInput: LoginUserInput, context: { req: { session: { username: string; }; }; }){
        const user = await this.usersService.findOne(loginUserInput.username);
        if(user){
            throw new Error('User already exists');
        }

        context.req.session.username = loginUserInput.username;
        //hash
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(loginUserInput.password, salt);
        return await this.usersService.createUser({...loginUserInput,password,});
    }

    async logout(context: { req: { session: { destroy: () => void; }; }; }){
        //login user input is to test in playground
        //should be "include" for request credentials
        context.req.session.destroy();
        if(context.req.session) return false;
        return true;
    }

    async checkUpdateTreeAndDate(user: User, lastDate: number, newDate: number){
        //get newest 5 svy rates within this time
        let lst = await this.surveyService.findRecentRatesByAuthor(user.username, lastDate, newDate);
            
        let ratelst = [];
        for(var survey of lst) {
            ratelst.push(survey.rate);
        }
        var sum = 0;
        ratelst.forEach(x => {sum += x;});
        let avg = sum/ratelst.length;
        if(avg > 3 && user.treeStatus < 3) { await this.usersService.updateStatus(user.username, 1);
        }
        else if(avg < 3 && user.treeStatus > 0) { await this.usersService.updateStatus(user.username, -1);
        }
        let updatedUser = await this.usersService.updateTreeDate(user.username, newDate)
        return updatedUser;
    }

}
