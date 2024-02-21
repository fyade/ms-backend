import { HttpException } from "@nestjs/common";

export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden.', 403)
  }
}