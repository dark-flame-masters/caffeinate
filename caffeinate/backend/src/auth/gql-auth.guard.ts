import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class GqlAuthGuard extends AuthGuard('local'){
    constructor(){
        super();
    }

    getRequest(context: ExecutionContext){
         const ctx = GqlExecutionContext.create(context);
         const request = ctx.getContext();
         request.body = ctx.getArgs().loginUserInput;
         //session
         /*request.req.session.username = ctx.getArgs().loginUserInput.username; 
         console.log(request.req.session);*/
         request.req.username = request.req.session.username;
         /*if(request.req.username === request.req.session.username)
            return request;
        throw new UnauthorizedException();*/

    }
}