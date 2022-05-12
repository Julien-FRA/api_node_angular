import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../classes/CustomError';

/**
 * @param err Error caught by Express.js
 * @param req Request object provided by Express
 * @param res Response object provided by Express
 * @param next NextFunction function provided by Express
 */

function handleError (
  err: TypeError | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let customError = err;

  if (!(err instanceof CustomError)) {
    customError = new CustomError(
      'Oh non, nous rencontrons actuellement un problème!'
    );
  }
  res.status((customError as CustomError).status).send(customError);
};

export default handleError;