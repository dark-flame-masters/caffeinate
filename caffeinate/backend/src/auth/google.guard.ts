import {
    CanActivate, ExecutionContext, Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class GoogleAuthGuard implements CanActivate {

    constructor(private readonly configService: ConfigService) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        let status: boolean = true;
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;

        // clear user info just in case
        request.userInfo = {};

        // verify CSRF token
        // TODO: Uncomment once frontend has implemented this + security has been addressed
        // const csrfCookie = request.cookies['g_csrf_token'];
        // const csrfBody = request.g_csrf_token;
        // if ((!csrfCookie || !csrfBody) || csrfCookie !== csrfBody) {
        //     return false;
        // }

        // verify tokenId
        const CLIENT_ID = this.configService.get<string>('GOOGLE_AUTH_CLIENT_ID');
        const client = new OAuth2Client(CLIENT_ID);
        try {
            const tokenId = request.headers['authorization'];
            const ticket = await client.verifyIdToken({
                idToken: tokenId,
                audience: CLIENT_ID,
            });
            const payload = ticket.getPayload();

            // add user information to request
            request.userInfo = {
                googleId: payload['sub'],
                firstName: payload['given_name'],
                email: payload['email']
            }
        } catch (e) {
            console.error(e);
            status = false;
        } finally {
            // TODO: Fix exception issue, should be thrown outside of this function
            if (!status) {
                throw new UnauthorizedException();
            }
            return status;
        }


    }
}
