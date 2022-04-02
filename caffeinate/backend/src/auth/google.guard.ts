import {
    CanActivate, ExecutionContext, forwardRef, Inject, Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthService } from "./auth.service";

@Injectable()
export class GoogleAuthGuard implements CanActivate {

    constructor(
        private readonly authService: AuthService) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;

        // clear user info just in case
        request.userInfo = {};

        // verify tokenId
        try {
            const accessToken = request.cookies['googleAccessToken'];

            // add user information to request
            request.userInfo = await this.authService.validate(accessToken);
            return true;
        } catch (e) {
            console.error(e);
            throw new UnauthorizedException('Invalid access token in cookie.');
        }


    }
}
