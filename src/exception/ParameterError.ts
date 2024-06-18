import { HttpException } from '@nestjs/common';

export class ParameterError extends HttpException {
  constructor(msg = '参数错误。') {
    super(msg, 500);
  }
}