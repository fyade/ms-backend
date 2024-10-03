import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PRE_AUTHORIZE_KEY, PreAuthorizeParams } from '../decorator/customDecorator';
import { AuthService } from '../module/auth/auth.service';
import { adminLoginUrl, reqWhiteList } from '../../config/authConfig';
import { ForbiddenException } from '../exception/ForbiddenException';
import { UserUnknownException } from '../exception/UserUnknownException';
import { CachePermissionService } from '../module/cache/cache.permission.service';
import { base } from '../util/base';
import { getCurrentUser } from '../util/baseContext';
import { Exception } from '../exception/Exception';
import { PrismaService } from '../prisma/prisma.service';
import { ParameterException } from '../exception/ParameterException';
import { UnauthorizedException } from '../exception/UnauthorizedException';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly cachePermissionService: CachePermissionService,
    private readonly prisma: PrismaService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizeParams = this.reflector.get<PreAuthorizeParams>(
      PRE_AUTHORIZE_KEY,
      context.getHandler(),
    );
    const { permission, ifSF, label } = authorizeParams;
    const request = context.switchToHttp().getRequest();
    const user = getCurrentUser().user;
    // const user = request.body.user as userDto2;
    // delete request.body.user;
    // request.body = request.body.reqBody;
    // 放行白名单接口
    if (reqWhiteList.includes(request.url)) {
      return true;
    }
    // 放行管理员登录接口
    if (request.url === adminLoginUrl && !!!user) {
      const userDto = await this.authService.findUserByUsername(request.body.username);
      if (!!!userDto) {
        throw new UserUnknownException();
      }
      const ifHasPermission = await this.authService.ifAdminUser(request.body.username);
      if (ifHasPermission) {
        return true;
      } else {
        throw new ForbiddenException(label);
      }
    }
    // 算法接口权限控制
    if (ifSF) {
      const permission = request.body.perms;
      if (!permission) {
        throw new ParameterException('参数错误，权限标识不可为空。');
      }
      if (user) {
        const permissionsOfUser = await this.authService.hasSFPermissionByUserid(user.userid, permission, request);
        if (permissionsOfUser) {
          return true;
        }
      }
      throw new Exception('您无当前算法权限。');
      // throw new ForbiddenException(label);
    }
    // 页面接口权限控制
    else {
      if (!user) {
        throw new UnauthorizedException();
      }
      // 操作日志
      await this.prisma.$queryRaw`
        insert into log_operation (perms, user_id, req_param, old_value, operate_type, if_success, remark)
        values (${permission}, ${user.userid}, '', '', '', '', '');
      `;
      // 是否公共接口
      const ifPublicInterfaceInCache = await this.cachePermissionService.getIfPublicPermissionInCache(permission);
      if (ifPublicInterfaceInCache) {
        if (ifPublicInterfaceInCache === base.Y) {
          return true;
        }
      } else {
        const ifPublicInterface = await this.authService.ifPublicInterface(permission);
        if (ifPublicInterface) {
          await this.cachePermissionService.setPublicPermissionInCache(permission);
          return true;
        }
        await this.cachePermissionService.setPublicPermissionInCache(permission, base.N);
      }
      // 用户是否有当前接口的权限
      if (user) {
        const ifHavePermissionInCache = await this.cachePermissionService.ifHavePermissionInCache(user.userid, permission);
        if (ifHavePermissionInCache) {
          return true;
        }
        const ifHasPermission = await this.authService.hasAdminPermissionByUserid(user.userid, permission);
        if (ifHasPermission) {
          await this.cachePermissionService.setPermissionInCache(user.userid, permission);
          return true;
        }
      }
    }
    throw new ForbiddenException(label);
  }
}