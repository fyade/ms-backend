import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';
import { UnknownException } from '../exception/UnknownException';
import { Request } from 'express';
import { BaseContextService } from '../module/base-context/base-context.service';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly baseContextService: BaseContextService
  ) {
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    // You can override the response object to customize the error response
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    try {
      response.status(exception.getStatus()).json({
        code: exception.getStatus(),
        msg: exception.message,
      });
    } catch (e) {
      const unknownException = new UnknownException(this.baseContextService.getUserData().reqId, exception);
      response.status(unknownException.getStatus()).json({
        code: unknownException.getStatus(),
        msg: unknownException.getMessage(),
      });
    }
  }
}
