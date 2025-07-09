import { ApiResponse } from 'response/api.response';

export class SuccessResponse {
  static create<T>(
    data: T,
    message = 'Success',
    statusCode = 200
  ): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      statusCode,
    };
  }

  static CREATED<T>(data: T, message = 'Created'): ApiResponse<T> {
    return this.create(data, message, 201);
  }

  static OK<T>(data: T, message = 'OK'): ApiResponse<T> {
    return this.create(data, message, 200);
  }

  static NO_CONTENT(message = 'No Content'): ApiResponse<null> {
    return {
      success: true,
      message,
      data: null,
      timestamp: new Date().toISOString(),
      statusCode: 204,
    };
  }
}
