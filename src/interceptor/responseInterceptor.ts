import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable, tap } from 'rxjs';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { PRE_AUTHORIZE_KEY, PreAuthorizeParams } from '../decorator/customDecorator';
import { R } from '../common/R';
import { AuthService } from '../module/auth/auth.service';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
  ) {
  }

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      tap(async (response: R) => {
        const request: Request = context.switchToHttp().getRequest();
        const authorizeParams = this.reflector.get<PreAuthorizeParams>(
          PRE_AUTHORIZE_KEY,
          context.getHandler(),
        );
        const { permission } = authorizeParams;
        await this.authService.insLogOperation(permission, request, response ? response.code === 200 : 'O');
      }),
      catchError(async (error) => {
        const request: Request = context.switchToHttp().getRequest();
        const authorizeParams = this.reflector.get<PreAuthorizeParams>(
          PRE_AUTHORIZE_KEY,
          context.getHandler(),
        );
        const { permission } = authorizeParams;
        await this.authService.insLogOperation(permission, request, false);
        throw error;
      }),
    );
  }
}
