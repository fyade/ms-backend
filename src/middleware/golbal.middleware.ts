import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class GlobalMiddleware implements NestMiddleware {
  constructor() {
  }

  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
