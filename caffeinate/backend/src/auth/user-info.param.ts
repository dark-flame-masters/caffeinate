import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

export class UserInfo {
    googleId: string;
    firstName: string;
    email: string;
}

export const GoogleUserInfo = createParamDecorator(
    (_data: string, ctx: ExecutionContext): UserInfo => {
        const gCtx = GqlExecutionContext.create(ctx).getContext();
        const request = gCtx.req;
        return request.userInfo;
    },
);
