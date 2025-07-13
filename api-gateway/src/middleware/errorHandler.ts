import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from 'response/api.response';
import { ErrorResponse } from 'response/error.respone';
import logger from 'utils/logger';

export interface CustomError extends Error {
  statusCode?: number;
  errorCode?: string;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let response: ApiResponse;

  if (error.name === 'ValidationError') {
    response = ErrorResponse.BADREQUEST(error.message, 'VALIDATION_001');
  } else if (
    error.name === 'MongoServerError' &&
    'code' in error &&
    (error as any).code === 11000
  ) {
    const field = Object.keys((error as any).keyPattern || {})[0] || 'resource';
    response = ErrorResponse.CONFLICT(
      `${field} already exists`,
      'DUPLICATE_409'
    );
  } else if (error.name === 'CastError') {
    response = ErrorResponse.BADREQUEST('Invalid ID format', 'CAST_400');
  } else if (error.statusCode) {
    response = ErrorResponse.create(
      error.message,
      error.errorCode || 'COMMON_' + error.statusCode,
      error.statusCode
    );
  } else {
    logger.error('Unhandled error:', error);
    response = ErrorResponse.INTERNAL(
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : error.message
    );
  }

  response.send(res);
};

export const notFound = (
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  ErrorResponse.NOTFOUND(`Route ${req.originalUrl} not found`).send(res);
};
