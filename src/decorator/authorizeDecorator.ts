import { PreAuthorize, PreAuthorizeParams } from './customDecorator';
import { applyDecorators, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../guard/authGuard';
import { PermissionGuard } from '../guard/permissionGuard';
import { ResponseInterceptor } from '../interceptor/responseInterceptor';

export function Authorize(param: string | PreAuthorizeParams) {
  let param_;
  if (typeof param === 'string') {
    param_ = {
      permission: param,
    };
  } else {
    param_ = param;
  }
  return applyDecorators(
    PreAuthorize(param_),
    UseGuards(AuthGuard),
    UseGuards(PermissionGuard),
    UseInterceptors(ResponseInterceptor),
  );
}
