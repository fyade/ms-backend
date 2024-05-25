import { HttpException } from '@nestjs/common';

export class EnvironmentIncorrect extends HttpException {
  constructor() {
    super('当前环境不支持此操作。', 500);
  }
}