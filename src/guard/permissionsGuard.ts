import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PRE_AUTHORIZE_KEY } from "../decorator/customDecorator";
import { AuthService } from "../module/auth/auth.service";
import { reqWhiteList } from "../config/authConfig";
import { ForbiddenException } from "../exception/ForbiddenException";

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService
  ) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.get<string>(
      PRE_AUTHORIZE_KEY,
      context.getHandler()
    );
    const request = context.switchToHttp().getRequest();
    if (reqWhiteList.indexOf(request.url) > -1) {
      return true
    }
    const user = request.body.user
    const ifHasPermission = await this.authService.hasPermission(user.userid, permission);
    if (ifHasPermission) {
      return true
    } else {
      throw new ForbiddenException()
    }
  }
}