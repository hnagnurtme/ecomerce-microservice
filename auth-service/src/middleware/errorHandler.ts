import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from 'response/api.response';
import { ErrorResponse } from 'response/error.respone';

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  let response: ApiResponse;

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    response = ErrorResponse.BADREQUEST(error.message, 'Validation failed');
  }
  // Mongoose duplicate key error
  else if (
    error.name === 'MongoServerError' &&
    'code' in error &&
    (error as { code: number }).code === 11000
  ) {
    const field = Object.keys(
      (error as unknown as { keyPattern: Record<string, unknown> }).keyPattern
    )[0];
    response = ErrorResponse.CONFLICT(
      `${field} already exists`,
      'Duplicate resource'
    );
  }
  // Mongoose cast error
  else if (error.name === 'CastError') {
    response = ErrorResponse.BADREQUEST(
      'Invalid ID format',
      'Invalid resource ID'
    );
  }
  // Custom error with status code
  else if (error.statusCode) {
    response = ErrorResponse.create(error.message, 'Error', error.statusCode);
  }
  // Default server error
  else {
    // eslint-disable-next-line no-console
    console.error('Unhandled error:', error);
    response = ErrorResponse.INTERNAL(
      process.env.NODE_ENV === 'production'
        ? 'Something went wrong'
        : error.message
    );
  }

  res.status(response.statusCode).json(response);
};

export const notFound = (
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void => {
  const response = ErrorResponse.NOTFOUND(`Route ${req.originalUrl} not found`);
  res.status(response.statusCode).json(response);
};
