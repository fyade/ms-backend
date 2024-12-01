import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PRE_AUTHORIZE_KEY, PreAuthorizeParams } from '../decorator/customDecorator';
import { AuthService } from '../module/auth/auth.service';
import { ForbiddenException } from '../exception/ForbiddenException';
import { Exception } from '../exception/Exception';
import { ParameterException } from '../exception/ParameterException';
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
    private readonly baseContextService: BaseContextService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const authorizeParams = this.reflector.get<PreAuthorizeParams>(
      PRE_AUTHORIZE_KEY,
      context.getHandler(),
    );
    const { permission, label, ifSF, ifIgnore, ifIgnoreButResolveToken, ifIgnoreParamInLog } = authorizeParams;
    const request: Request = context.switchToHttp().getRequest();

    if (ifIgnore && !ifIgnoreButResolveToken) {
    } else {
      const oauth = request.headers['authorization'];
      const token = typeof oauth === 'string' ? (oauth.startsWith('Bearer') ? oauth.substring(6) : oauth).trim() : '';
      try {
        const decoded = await this.cacheTokenService.verifyToken(token);
        if (decoded) {
          // Token is valid and not expired
          this.baseContextService.setUserData(genCurrentUser(decoded.userid, token, decoded.loginRole));
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
    const userId = this.baseContextService.getUserData().userId;
    const loginRole = this.baseContextService.getUserData().loginRole;
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
      if (userId) {
        const permissionsOfUser = await this.authService.hasSFPermissionByUserid(userId, loginRole, permission, request);
        if (permissionsOfUser) {
          return true;
        }
      }
      await this.authService.insLogOperation(permission, request, false, {
        remark: '您无当前算法权限。',
        ifIgnoreParamInLog,
      });
      throw new Exception('您无当前算法权限。');
    }
    // 页面接口权限控制
    else {
      // 是否公共接口
      const ifPublicInterface = await this.authService.ifPublicInterface(permission);
      if (ifPublicInterface) {
        // 请求ip是否在此接口的ip白名单中
        const ifIpInWhiteList = await this.authService.ifIpInWhiteListOfPermission(permission, request);
        if (!ifIpInWhiteList) {
          await this.authService.insLogOperation(permission, request, false, {
            remark: '请求源IP不在白名单内。',
            ifIgnoreParamInLog,
          });
          throw new IpNotInWhiteListException();
        }
        return true;
      }
      if (!userId) {
        await this.authService.insLogOperation(permission, request, false, { remark: '403', ifIgnoreParamInLog });
        throw new ForbiddenException(label);
      }
      // 请求ip是否在此接口的ip白名单中
      const ifIpInWhiteList = await this.authService.ifIpInWhiteListOfPermission(permission, request);
      if (!ifIpInWhiteList) {
        const b = await this.authService.hasTopAdminPermission(userId);
        if (!b) {
          await this.authService.insLogOperation(permission, request, false, {
            remark: '请求源IP不在白名单内。',
            ifIgnoreParamInLog,
          });
          throw new IpNotInWhiteListException();
        }
      }
      // 用户是否有当前接口的权限
      const ifHasPermission = await this.authService.hasAdminPermissionByUserid(userId, permission, loginRole);
      if (ifHasPermission) {
        return true;
      }
      await this.authService.insLogOperation(permission, request, false, { remark: '403', ifIgnoreParamInLog });
      throw new ForbiddenException(label);
    }
  }
}
