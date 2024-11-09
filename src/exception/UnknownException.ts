import { HttpException, Logger } from '@nestjs/common';
import { getCurrentUser } from '../util/baseContext';

export class UnknownException extends HttpException {
  constructor(exception?: HttpException) {
    const logger = new Logger();
    const id = getCurrentUser().reqId;
    super(`未知错误，请反馈管理员并提供此识别码：${id}。`, 501);
    logger.error(`${this.message}`);
    if (exception) {
      logger.error(`${id}的错误信息如下：`)
      logger.error(exception);
    }
  }

  getMessage() {
    return this.message;
  }

  getResponse() {
    return super.getResponse() as { statusCode: number, message: string, error: string };
  }
}