import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Injectable } from '@nestjs/common';
import { UnknownException } from '../exception/UnknownException';
import { Request } from 'express';
import { BaseContextService } from '../module/base-context/base-context.service';
import { HTTP } from '../common/Enum';
import { R } from '../common/R';

@Catch()
@Injectable()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(
    private readonly baseContextService: BaseContextService,
  ) {
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    // You can override the response object to customize the error response
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request: Request = ctx.getRequest();
    try {
      response.status(HTTP.SERVER_ERROR().code).json(new R(exception.getStatus(), null, exception.message));
    } catch (e) {
      const unknownException = new UnknownException(this.baseContextService.getUserData().reqId, exception);
      response.status(unknownException.getStatus()).json(new R(unknownException.getStatus(), null, unknownException.getMessage()));
    }
  }
}
