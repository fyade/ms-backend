import { PreAuthorize } from './customDecorator';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { PermissionsGuard } from '../guard/permissionsGuard';

export function Authorize(permission: string, {
                            ifSF = false,
                          }: {
                            ifSF?: boolean
                          } = {},
) {
  return applyDecorators(
    PreAuthorize({ permission, ifSF }),
    UseGuards(PermissionsGuard),
  );
}