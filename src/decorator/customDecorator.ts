import { createParamDecorator, ExecutionContext, SetMetadata } from "@nestjs/common";

export const GetReqUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest()
    return request.body.user
  }
)

export const PRE_AUTHORIZE_KEY = 'perAuthorize'
export const PreAuthorize = (permission: string) => SetMetadata(PRE_AUTHORIZE_KEY, permission)
