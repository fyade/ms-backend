import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '../exception/UnauthorizedException';
import { clearCurrentUser, setCurrentUser } from '../util/baseContext';
import { UserDto2 } from '../module/module/main/sys-manage/user/dto';
import { CacheTokenService } from '../module/cache/cache.token.service';
import { PRE_AUTHORIZE_KEY, PreAuthorizeParams } from '../decorator/customDecorator';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../module/auth/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly cacheTokenService: CacheTokenService,
    private readonly authService: AuthService,
  ) {
  }

  async canActivate(context: ExecutionContext) {
    const authorizeParams = this.reflector.get<PreAuthorizeParams>(
      PRE_AUTHORIZE_KEY,
      context.getHandler(),
    );
    const { ifIgnore, ifAdminLogin, permission } = authorizeParams;
    clearCurrentUser();
    const request = context.switchToHttp().getRequest();
    // request.body = {
    //   reqBody: request.body,
    // };
    const oauth = request.headers['authorization'];
    const token = typeof oauth === 'string' ? (oauth.startsWith('Bearer') ? oauth.substring(6) : oauth).trim() : '';
    if (ifIgnore || ifAdminLogin) {
    } else if (token) {
      try {
        const decoded = await this.cacheTokenService.verifyToken(token);
        if (decoded) {
          // Token is valid and not expired
          // request.body.user = decoded;
          await setCurrentUser(decoded as UserDto2, token);
        } else {
          // Token is invalid or expired
          await this.authService.insLogOperation(permission, request, false, '401');
          throw new UnauthorizedException();
        }
      } catch (e) {
        // Token is invalid or expired
        await this.authService.insLogOperation(permission, request, false, '401');
        throw new UnauthorizedException();
      }
    }
    return true;
  }
}