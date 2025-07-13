import { ApiResponse } from './api.response';

export class ErrorResponse extends ApiResponse<null> {
    constructor(error: string, message = 'Error', statusCode = 500) {
        super(false, message, statusCode, null, error);
    }

    static create(error: string, message = 'Error', statusCode = 500): ErrorResponse {
        return new ErrorResponse(error, message, statusCode);
    }

    static BADREQUEST(error: string, message = 'Bad Request') {
        return this.create(error, message, 400);
    }

    static UNAUTHORIZED(error = 'Unauthorized', message = 'Authentication required') {
        return this.create(error, message, 401);
    }

    static FORBIDDEN(error = 'Forbidden', message = 'Access denied') {
        return this.create(error, message, 403);
    }

    static NOTFOUND(error = 'Not found', message = 'Resource not found') {
        return this.create(error, message, 404);
    }

    static CONFLICT(error: string, message = 'Conflict') {
        return this.create(error, message, 409);
    }

    static INTERNAL(error = 'Internal server error', message = 'Something went wrong') {
        return this.create(error, message, 500);
    }
}
