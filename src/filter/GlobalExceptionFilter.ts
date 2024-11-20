import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { UnknownException } from '../exception/UnknownException';
import { Request } from 'express';
import { getReqIdFromReqHeader } from '../module/base-context/baseContext';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor() {
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
      const unknownException = new UnknownException(getReqIdFromReqHeader(request), exception);
      response.status(unknownException.getStatus()).json({
        code: unknownException.getStatus(),
        msg: unknownException.getMessage(),
      });
    }
  }
}