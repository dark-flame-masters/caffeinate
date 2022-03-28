import {
    CanActivate, ExecutionContext, Injectable, applyDecorators,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { GqlExecutionContext } from "@nestjs/graphql";
import { OAuth2Client } from "google-auth-library";

@Injectable()
export class GoogleAuthGuard implements CanActivate {

    constructor(private readonly configService: ConfigService) { }

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const request = ctx.getContext().req;

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
            const userId = payload['sub'];
            request.userId = userId; // sets request to userId  
            return true
        } catch (e) {
            console.error(e);
            return false;
        }


    }
}
