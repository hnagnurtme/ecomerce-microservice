import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from 'response/api.response';
import { ErrorResponse } from 'response/error.respone';
import logger from 'utils/logger';

export interface CustomError extends Error {
    statusCode?: number;
}

export const errorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    let response: ApiResponse;

    if (error.name === 'ValidationError') {
        response = ErrorResponse.BADREQUEST(error.message, 'Validation failed');
    } else if (
        error.name === 'MongoServerError' &&
        'code' in error &&
        (error as { code: number; keyPattern?: Record<string, unknown> }).code === 11000
    ) {
        const mongoError = error as {
            code: number;
            keyPattern?: Record<string, unknown>;
        };
        const field = mongoError.keyPattern ? Object.keys(mongoError.keyPattern)[0] : 'resource';
        response = ErrorResponse.CONFLICT(`${field} already exists`, 'Duplicate resource');
    } else if (error.name === 'CastError') {
        response = ErrorResponse.BADREQUEST('Invalid ID format', 'Invalid resource ID');
    } else if (error.statusCode) {
        response = ErrorResponse.create(error.message, 'Error', error.statusCode);
    } else {
        logger.error('Unhandled error:', error);
        response = ErrorResponse.INTERNAL(
            process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
        );
    }

    response.send(res);
};

export const notFound = (req: Request, res: Response, _next: NextFunction): void => {
    ErrorResponse.NOTFOUND(`Route ${req.originalUrl} not found`).send(res);
};
