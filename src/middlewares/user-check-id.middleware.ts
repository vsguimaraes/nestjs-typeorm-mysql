import { BadRequestException, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export class UserCheckIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('UserCheckIdMiddleWare', 'antes');

    if (isNaN(Number(req.params.id)) || Number(req.params.id) <= 0) {
      throw new BadRequestException('ID do usuário inválido!');
    }
    console.log('UserCheckIdMiddleWare', 'depois');
    next();
  }
}
