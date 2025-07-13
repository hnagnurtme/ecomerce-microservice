import { ApiResponse } from './api.response';

export class SuccessResponse<T = unknown> extends ApiResponse<T> {
    constructor(data: T, message = 'Success', statusCode = 200) {
        super(true, message, statusCode, data);
    }

    static OK<T>(data: T, message = 'OK') {
        return new SuccessResponse<T>(data, message, 200);
    }

    static CREATED<T>(data: T, message = 'Created') {
        return new SuccessResponse<T>(data, message, 201);
    }

    static NO_CONTENT(message = 'No Content') {
        return new SuccessResponse<null>(null, message, 204);
    }
}
