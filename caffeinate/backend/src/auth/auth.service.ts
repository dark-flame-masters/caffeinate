import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';
import { SurveyService } from 'src/survey/survey.service';
import { User } from 'src/users/users.schema';
import { UserInfo } from './user-info.param';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class AuthService {

    private authClient: OAuth2Client;

    constructor(private usersService: UsersService, 
        private surveyService: SurveyService, 
        private configService: ConfigService) { 
            const CLIENT_ID = this.configService.get<string>('GOOGLE_AUTH_CLIENT_ID');
            this.authClient = new OAuth2Client(CLIENT_ID);
    }

    public async validate(accessToken: string) {
        const tokenInfo = await this.authClient.getTokenInfo(accessToken);
        return {
            googleId: tokenInfo['sub'],
            email: tokenInfo['email']
        }
    }

    public async login(userInfo: UserInfo) {
        let user = await this.usersService.findOne(userInfo.googleId);
        if (!user) {
            user = await this.signup(userInfo);
        }

        // update tree on login
        const dateDist = 600000; //600000 ms = 10 mins
        let newDate = new Date().valueOf();
        let lastDate = user.treeDate.valueOf();
        let updatedUser = user;
        if (newDate - lastDate >= dateDist) {
            updatedUser = await this.checkUpdateTreeAndDate(user, lastDate, newDate);
        }
        return {
            user: updatedUser,
        };

    }

    async signup(userInfo: UserInfo): Promise<User> {
        return await this.usersService.createUser(userInfo);
    }

    public async logout(request: Request) {
        const accessToken = request.headers['authorization'];
        await this.authClient.revokeToken(accessToken);
    }

    async checkUpdateTreeAndDate(user: User, lastDate: number, newDate: number) {
        //get newest 5 svy rates within this time
        let lst = await this.surveyService.findRecentRatesByAuthor(user.googleId, lastDate, newDate);

        let ratelst = [];
        for (var survey of lst) {
            ratelst.push(survey.rate);
        }
        var sum = 0;
        ratelst.forEach(x => { sum += x; });
        let avg = sum / ratelst.length;
        if (avg > 3 && user.treeStatus < 3) {
            await this.usersService.updateStatus(user.googleId, 1);
        }
        else if (avg < 3 && user.treeStatus > 0) {
            await this.usersService.updateStatus(user.googleId, -1);
        }
        let updatedUser = await this.usersService.updateTreeDate(user.googleId, newDate)
        return updatedUser;
    }

}
