import { PreAuthorize, PreAuthorizeParams } from './customDecorator';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guard/permissionsGuard';

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
    UseGuards(PermissionsGuard),
  );
}