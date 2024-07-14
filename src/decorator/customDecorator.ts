import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

// export const GetReqUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.body.user;
//   },
// );

export const PRE_AUTHORIZE_KEY = 'perAuthorize';

export class PreAuthorizeParams {
  permission: string;
  ifSF?: boolean;
  label?:string
}

export const PreAuthorize = (param: PreAuthorizeParams) => SetMetadata(PRE_AUTHORIZE_KEY, param);

