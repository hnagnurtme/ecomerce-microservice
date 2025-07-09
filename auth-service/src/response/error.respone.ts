import { ApiResponse } from 'response/api.response';
export class ErrorResponse {
  static create(
    error: string,
    message = 'Error',
    statusCode = 500
  ): ApiResponse<null> {
    return {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      statusCode,
    };
  }

  static BADREQUEST(error: string, message = 'Bad Request'): ApiResponse {
    return this.create(error, message, 400);
  }

  static UNAUTHORIZED(
    error = 'Unauthorized',
    message = 'Authentication required'
  ): ApiResponse {
    return this.create(error, message, 401);
  }

  static FORBIDDEN(
    error = 'Forbidden',
    message = 'Access denied'
  ): ApiResponse {
    return this.create(error, message, 403);
  }

  static NOTFOUND(
    error = 'Not found',
    message = 'Resource not found'
  ): ApiResponse {
    return this.create(error, message, 404);
  }

  static CONFLICT(error: string, message = 'Conflict'): ApiResponse {
    return this.create(error, message, 409);
  }

  static INTERNAL(
    error = 'Internal server error',
    message = 'Something went wrong'
  ): ApiResponse {
    return this.create(error, message, 500);
  }
}
