import { PreAuthorize } from './customDecorator';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guard/permissionsGuard';

export function Authorize(permission: string) {
  return applyDecorators(
    PreAuthorize(permission),
    UseGuards(PermissionsGuard),
  );
}