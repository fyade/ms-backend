import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { UnknownException } from '../exception/UnknownException';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // You can override the response object to customize the error response
    const response = host.switchToHttp().getResponse();
    try {
      response.status(exception.getStatus()).json({
        code: exception.getStatus(),
        msg: exception.message,
      });
    } catch (e) {
      const unknownException = new UnknownException(exception);
      response.status(unknownException.getStatus()).json({
        code: unknownException.getStatus(),
        msg: unknownException.getMessage(),
      });
    }
  }
}