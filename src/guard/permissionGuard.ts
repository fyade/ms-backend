import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PRE_AUTHORIZE_KEY, PreAuthorizeParams } from '../decorator/customDecorator';
import { AuthService } from '../module/auth/auth.service';
import { ForbiddenException } from '../exception/ForbiddenException';
import { UserUnknownException } from '../exception/UserUnknownException';
import { CachePermissionService } from '../module/cache/cache.permission.service';
import { base } from '../util/base';
import { Exception } from '../exception/Exception';
import { ParameterException } from '../exception/ParameterException';
import { LoginDto, UserDto2 } from '../module/module/main/sys-manage/user/dto';
import { AlgorithmDto } from '../module/module/algorithm/algorithm/dto';
import { Request } from 'express';
import { IpNotInWhiteListException } from '../exception/IpNotInWhiteListException';
import { genCurrentUser } from '../module/base-context/baseContext';
import { UnauthorizedException } from '../exception/UnauthorizedException';
import { CacheTokenService } from '../module/cache/cache.token.service';
import { BaseContextService } from '../module/base-context/base-context.service';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly cacheTokenService: CacheTokenService,
    private readonly cachePermissionService: CachePermissionService,
    private readonly baseContextService: BaseContextService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizeParams = this.reflector.get<PreAuthorizeParams>(
      PRE_AUTHORIZE_KEY,
      context.getHandler(),
    );
    const { permission, label, ifSF, ifIgnore, ifAdminLogin, ifIgnoreParamInLog } = authorizeParams;
    const request: Request = context.switchToHttp().getRequest();

    const oauth = request.headers['authorization'];
    const token = typeof oauth === 'string' ? (oauth.startsWith('Bearer') ? oauth.substring(6) : oauth).trim() : '';
    if (ifIgnore || ifAdminLogin) {
    } else if (token) {
      try {
        const decoded = await this.cacheTokenService.verifyToken(token);
        if (decoded) {
          // Token is valid and not expired
          this.baseContextService.setUserData(genCurrentUser(decoded as UserDto2, token));
        } else {
          // Token is invalid or expired
          await this.authService.insLogOperation(permission, request, false, { remark: '401', ifIgnoreParamInLog });
          throw new UnauthorizedException();
        }
      } catch (e) {
        // Token is invalid or expired
        await this.authService.insLogOperation(permission, request, false, { remark: '401', ifIgnoreParamInLog });
        throw new UnauthorizedException();
      }
    }

    // 放行白名单接口
    if (ifIgnore) {
      return true;
    }
    const user = this.baseContextService.getUserData().user;
    // 放行管理员登录接口
    if (ifAdminLogin && !!!user) {
      const reqBody = request.body as unknown as LoginDto;
      const userDto = await this.authService.findUserByUsername(reqBody.username);
      if (!!!userDto) {
        await this.authService.insLogOperation(permission, request, false, {
          remark: '用户不存在。',
          ifIgnoreParamInLog,
        });
        throw new UserUnknownException();
      }
      const ifHasPermission = await this.authService.ifAdminUser(reqBody.username);
      if (ifHasPermission) {
        return true;
      } else {
        await this.authService.insLogOperation(permission, request, false, { remark: '403', ifIgnoreParamInLog });
        throw new ForbiddenException(label);
      }
    }
    // 算法接口权限控制
    if (ifSF) {
      const reqBody = request.body as unknown as AlgorithmDto;
      const permission = reqBody.perms;
      if (!permission) {
        await this.authService.insLogOperation(permission, request, false, {
          remark: '参数错误，权限标识不可为空。',
          ifIgnoreParamInLog,
        });
        throw new ParameterException('参数错误，权限标识不可为空。');
      }
      if (user) {
        const permissionsOfUser = await this.authService.hasSFPermissionByUserid(user.userid, permission, request);
        if (permissionsOfUser) {
          return true;
        }
      }
      await this.authService.insLogOperation(permission, request, false, {
        remark: '用户您无当前算法权限。',
        ifIgnoreParamInLog,
      });
      throw new Exception('您无当前算法权限。');
      // throw new ForbiddenException(label);
    }
    // 页面接口权限控制
    else {
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
      // 请求ip是否在此接口的ip白名单中
      const ifIpInWhiteList = await this.authService.ifIpInWhiteListOfPermission(permission, request);
      if (!ifIpInWhiteList) {
        const b = await this.authService.hasTopAdminPermission(user.userid);
        if (!b) {
          await this.authService.insLogOperation(permission, request, false, {
            remark: '请求源IP不在白名单内。',
            ifIgnoreParamInLog,
          });
          throw new IpNotInWhiteListException();
        }
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
    await this.authService.insLogOperation(permission, request, false, { remark: '403', ifIgnoreParamInLog });
    throw new ForbiddenException(label);
  }
}
