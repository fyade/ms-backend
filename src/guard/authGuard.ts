import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { adminLoginUrl, reqWhiteList } from '../../config/authConfig';
import { UnauthorizedException } from '../exception/UnauthorizedException';
import { clearCurrentUser, setCurrentUser } from '../util/baseContext';
import { userDto2 } from '../module/sys-manage/user/dto';
import { verifyToken } from '../util/AuthUtils';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    clearCurrentUser();
    const request = context.switchToHttp().getRequest();
    request.body = {
      reqBody: request.body,
    };
    const token = request.headers['authorization'];
    if (reqWhiteList.indexOf(request.url) > -1 || request.url === adminLoginUrl) {
    } else if (token) {
      try {
        const decoded = verifyToken(token);
        if (decoded) {
          // Token is valid and not expired
          request.body.user = decoded;
          setCurrentUser(decoded as userDto2, token);
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