import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { SurveyService } from 'src/survey/survey.service';
import { User } from 'src/users/users.schema';
import { UserInfo } from './user-info.param';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService, private surveyService: SurveyService){}

    public async login(userInfo: UserInfo){
        let user = await this.usersService.findOne(userInfo.googleId);
        if (!user) {
            user = await this.signup(userInfo);
        }

        // TODO: Ask yara if she needs sessions/cookies for googleId

        // update tree on login
        const dateDist = 600000; //600000 ms = 10 mins
        let newDate = new Date().valueOf();
        let lastDate = user.treeDate.valueOf();
        let updatedUser = user;
        if(newDate - lastDate >= dateDist){
            updatedUser = await this.checkUpdateTreeAndDate(user, lastDate, newDate);
        }
        return {
            user: updatedUser,
        };
        
    }

    async signup(userInfo: UserInfo): Promise<User> {
        return await this.usersService.createUser(userInfo);
    }

    public async logout(){
        // TODO: Implement
    }

    async checkUpdateTreeAndDate(user: User, lastDate: number, newDate: number){
        //get newest 5 svy rates within this time
        let lst = await this.surveyService.findRecentRatesByAuthor(user.googleId, lastDate, newDate);
            
        let ratelst = [];
        for(var survey of lst) {
            ratelst.push(survey.rate);
        }
        var sum = 0;
        ratelst.forEach(x => {sum += x;});
        let avg = sum/ratelst.length;
        if(avg > 3 && user.treeStatus < 3) { await this.usersService.updateStatus(user.googleId, 1);
        }
        else if(avg < 3 && user.treeStatus > 0) { await this.usersService.updateStatus(user.googleId, -1);
        }
        let updatedUser = await this.usersService.updateTreeDate(user.googleId, newDate)
        return updatedUser;
    }

}
