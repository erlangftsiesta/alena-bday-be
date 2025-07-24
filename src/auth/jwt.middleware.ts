// src/auth/jwt.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import { CustomRequest } from './auth.controller';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.cookies?.['access_token'];
    if (!token) return next();

    try {
      const payload = jwt.verify(token, 'RAHASIA_BOS') as any;
      req.user = { id: payload.sub };
    } catch (e) {
      // Token invalid
      req.user = null;
    }

    next();
  }
}
