import { HttpException } from '@nestjs/common';

export class VerificationCodeErrorException extends HttpException {
  constructor(msg = '验证码错误。') {
    super(msg, 50002);
  }
}
