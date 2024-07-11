import { HttpException } from '@nestjs/common';

export class ForbiddenException extends HttpException {
  constructor(label = '') {
    super(label, 403);
  }
}