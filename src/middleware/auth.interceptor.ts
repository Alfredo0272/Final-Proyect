import createDebug from 'debug';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../types/http.error.js';
import { Auth } from '../services/auth.js';
const debug = createDebug(
  'W9Final:Alt Rebel scum this is the interceptor:middleware'
);

export class AuthInterceptor {
  constructor() {
    debug('Instantiated');
  }

  authorization(req: Request, _res: Response, next: NextFunction) {
    try {
      const tokenHeader = req.get('Authorization');
      if (!tokenHeader || !tokenHeader.startsWith('Bearer'))
        throw new HttpError(401, 'Middleware says you are Unauthorized');
      const token = tokenHeader.split(' ')[1];
      const tokenPayload = Auth.verifyAndGetPayload(token);
      req.body.userId = tokenPayload.id;
      req.body.role = tokenPayload.role;
      next();
    } catch (error) {
      next(error);
    }
  }

  isAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.body.role !== 'Admin')
        throw new HttpError(403, 'Forbidden', 'Not authorized');
      next();
    } catch (error) {
      next(error);
    }
  }
}
