import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../module/auth/auth.service';
import { CacheTokenService } from '../module/cache/cache.token.service';
import { BaseContextService } from '../module/base-context/base-context.service';
import { Request } from 'express';
import { UnauthorizedException } from '../exception/UnauthorizedException';
import { getTokenUuidFromAuth } from '../util/RequestUtils';
import { genCurrentUser } from '../module/base-context/baseContext';

@Injectable()
export class StaticGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    private readonly cacheTokenService: CacheTokenService,
    private readonly baseContextService: BaseContextService,
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const query = request.query;
    const oauth = query['authorization'];
    if (!oauth) {
      throw new UnauthorizedException();
    }
    try {
      const token = getTokenUuidFromAuth(oauth as string);
      const decoded = await this.cacheTokenService.verifyToken(token);
      if (decoded) {
        this.baseContextService.setUserData(genCurrentUser(decoded.userid, token, decoded.loginRole));
      } else {
        throw new UnauthorizedException();
      }
      const userData = this.baseContextService.getUserData();
      const b = await this.authService.ifAdminUser(decoded.userid, decoded.loginRole);
      return true;
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }
}
