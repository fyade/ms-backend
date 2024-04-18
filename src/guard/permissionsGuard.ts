import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PRE_AUTHORIZE_KEY } from '../decorator/customDecorator';
import { AuthService } from '../module/sys/auth/auth.service';
import { adminLoginUrl, reqWhiteList } from '../config/authConfig';
import { ForbiddenException } from '../exception/ForbiddenException';
import { UserUnknownException } from '../exception/UserUnknownException';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string>(
      PRE_AUTHORIZE_KEY,
      context.getHandler(),
    );
    const request = context.switchToHttp().getRequest();
    if (reqWhiteList.indexOf(request.url) > -1) {
      return true;
    }
    const user = request.body.user;
    // 放行管理员登陆接口
    if (!!!user && request.url === adminLoginUrl) {
      const userDto = await this.authService.findUserByUsername(request.body.username);
      if (!!!userDto) {
        throw new UserUnknownException();
      }
      const ifHasPermission = await this.authService.ifAdminUser(request.body.username);
      if (ifHasPermission) {
        return true;
      } else {
        throw new ForbiddenException();
      }
    }
    delete request.body.user;
    // 用户是否有当前接口的权限
    const ifHasPermission = await this.authService.hasAdminPermissionByUserid(user.userid, permission);
    if (ifHasPermission) {
      return true;
    } else {
      throw new ForbiddenException();
    }
  }
}