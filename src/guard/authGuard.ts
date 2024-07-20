import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { adminLoginUrl, reqWhiteList } from '../../config/authConfig';
import { UnauthorizedException } from '../exception/UnauthorizedException';
import { clearCurrentUser, setCurrentUser } from '../util/baseContext';
import { userDto2 } from '../module/sys-manage/user/dto';
import { CacheTokenService } from '../module/cache/cache.token.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly cacheTokenService: CacheTokenService,
  ) {
  }

  async canActivate(context: ExecutionContext) {
    clearCurrentUser();
    const request = context.switchToHttp().getRequest();
    // request.body = {
    //   reqBody: request.body,
    // };
    const oauth = request.headers['authorization'];
    const token = typeof oauth === 'string' ? (oauth.startsWith('Bearer ') ? oauth.substring(7) : oauth) : '';
    if (reqWhiteList.indexOf(request.url) > -1 || request.url === adminLoginUrl) {
    } else if (token) {
      try {
        const decoded = await this.cacheTokenService.verifyToken(token);
        if (decoded) {
          // Token is valid and not expired
          // request.body.user = decoded;
          await setCurrentUser(decoded as userDto2, token);
        } else {
          // Token is invalid or expired
          throw new UnauthorizedException();
        }
      } catch (e) {
        // Token is invalid or expired
        throw new UnauthorizedException();
      }
    }
    return true;
  }
}