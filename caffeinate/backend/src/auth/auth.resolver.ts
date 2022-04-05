import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Context, Mutation, Resolver } from '@nestjs/graphql';
import { ExpressContext } from 'apollo-server-express';
import { CookieOptions } from 'express';
import { ThrottlerProxyGQLGuard } from 'src/throttle/throttler-proxy-gql.guard';
import { AuthService } from './auth.service';
import { LoginResponse } from './login-response';
import { GoogleAuthGuard } from './google.guard';

@Resolver()
export class AuthResolver {
    private cookieOptions: CookieOptions = {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 // expires in 1 day
    }
    constructor(private authService: AuthService,
        configService: ConfigService) {
        if (configService.get('SECURE_COOKIES') === 'true') {
            this.cookieOptions = {
                ...this.cookieOptions,
                httpOnly: true,
                secure: true,
                sameSite: 'strict',
            }
        }
    }

    @Mutation(() => LoginResponse)
    @UseGuards(ThrottlerProxyGQLGuard)
    public async login(@Context() ctx: ExpressContext) {
        try {
            const userInfo = await this.authService.validate(ctx.req.headers['authorization']);
            const user = await this.authService.login(userInfo);
            ctx.req.res.cookie('googleAccessToken', ctx.req.headers['authorization'], this.cookieOptions);
            return user;
        } catch (err) {
            console.error(err);
            throw new UnauthorizedException('Invalid access token in Authorization header.');
        }
    }

    @Mutation(() => Boolean)
    @UseGuards(ThrottlerProxyGQLGuard)
    @UseGuards(GoogleAuthGuard)
    public async logout(@Context() ctx: ExpressContext) {
        await this.authService.logout(ctx.req);
        ctx.req.res.cookie('googleAccessToken', '', this.cookieOptions);
        return true;
    }
}
