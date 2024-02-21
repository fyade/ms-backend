import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { jwtConstants, reqWhiteList } from '../config/authConfig';
import { UnauthorizedException } from '../exception/UnauthorizedException';
import { clearCurrentUser, setCurrentUser } from '../util/baseContext';
import { userDto2 } from '../module/user/dto';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    clearCurrentUser();
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization'];
    if (token) {
      try {
        const decoded = jwt.verify(token, jwtConstants.secret);
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
    } else if (reqWhiteList.indexOf(request.url) === -1) {
      throw new UnauthorizedException();
    }
    return true;
  }
}