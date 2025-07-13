import { Response } from 'express';
import { ApiResponse } from './api.response';

export class ErrorResponse extends ApiResponse<null> {
    constructor(message: string, error: string, statusCode: number = 500) {
        super(false, message, statusCode, null, error);
    }

    static create(message: string, error: string, statusCode: number = 500): ErrorResponse {
        return new ErrorResponse(message, error, statusCode);
    }

    static UNAUTHORIZED(
        message = 'Authentication required',
        error = 'AUTH_0101',
        statusCode = 401,
    ) {
        return this.create(message, error, statusCode);
    }

    static BADREQUEST(message = 'Bad request', error = 'COMMON_400', statusCode = 400) {
        return this.create(message, error, statusCode);
    }

    static FORBIDDEN(message = 'Access denied', error = 'AUTH_0102', statusCode = 403) {
        return this.create(message, error, statusCode);
    }

    static NOTFOUND(message = 'Resource not found', error = 'COMMON_404', statusCode = 404) {
        return this.create(message, error, statusCode);
    }

    static CONFLICT(message = 'Conflict occurred', error = 'COMMON_409', statusCode = 409) {
        return this.create(message, error, statusCode);
    }

    static INTERNAL(message = 'Something went wrong', error = 'COMMON_500', statusCode = 500) {
        return this.create(message, error, statusCode);
    }

    send(res: Response, headers: Record<string, string> = {}) {
        return super.send(res, headers);
    }
}
