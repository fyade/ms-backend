import { HttpException, Logger } from "@nestjs/common";
import { genId } from '../util/IdUtils';

export class UnknownException extends HttpException {
  constructor() {
    const logger = new Logger();
    const id = genId();
    super(`未知错误，请反馈管理员并提供此识别码：${id}。`, 500);
    logger.error(`${id} ${this.message}`)
  }

  getMessage() {
    return this.getResponse().message
  }

  getResponse() {
    return super.getResponse() as { statusCode: number, message: string, error: string };
  }
}