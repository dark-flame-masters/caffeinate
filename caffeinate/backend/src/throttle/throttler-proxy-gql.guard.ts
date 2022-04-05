// import { ThrottlerGuard } from '@nestjs/throttler';
// import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
// import { GqlExecutionContext } from '@nestjs/graphql';

// // note: You cannot bind the guard with APP_GUARD or app.useGlobalGuards() due to how Nest binds global guards.
// //  https://github.com/nestjs/throttler
// @Injectable()
// export class ThrottlerProxyGQLGuard extends ThrottlerGuard {
  
//   protected getTracker(req: Record<string, any>): string {
//     return req.ips.length ? req.ips[0] : req.ip;
//   }

//   getRequestResponse(context: ExecutionContext) {
//     const gqlCtx = GqlExecutionContext.create(context);
//     const ctx = gqlCtx.getContext();
//     return { req: ctx.req, res: ctx.req.res }
//   }
// }
