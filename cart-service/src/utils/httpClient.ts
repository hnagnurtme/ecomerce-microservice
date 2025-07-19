import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { ApiResponse } from 'response';
import logger from './logger';
import appConfig from 'config/app.config';
const gatewayApiKey = appConfig.apiKey.gateway as string;
interface ApiResponseData<T> {
    success: boolean;
    message: string;
    statusCode: number;
    data: T | null;
    error?: string;
    timestamp: string;
}

export class HttpService {
    private client: AxiosInstance;

    constructor(baseURL: string, timeout = 5000) {
        this.client = axios.create({
            baseURL,
            timeout,
        });

        this.client.interceptors.request.use((config) => {
            logger.info(
                `[HttpService] Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
            );
            config.headers = config.headers || {};
            config.headers['Content-Type'] = 'application/json';
            config.headers['Accept'] = 'application/json';
            config.headers['x-gateway-api-key'] = gatewayApiKey;
            logger.info(`[HttpService] Request Headers: ${JSON.stringify(config.headers)}`);
            return config;
        });

        this.client.interceptors.response.use(
            (res) => res,
            (error) => {
                logger.error(`[HttpService] ${error.message}`);
                return Promise.reject(error);
            },
        );
    }

    async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.get<ApiResponseData<T>>(url, config);
            return new ApiResponse<T>(
                response.data.success,
                response.data.message,
                response.data.statusCode,
                response.data.data,
                response.data.error,
            );
        } catch (error: any) {
            return this.handleError<T>(error, url, 'GET');
        }
    }

    async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.post<ApiResponseData<T>>(url, data, config);
            return new ApiResponse<T>(
                response.data.success,
                response.data.message,
                response.data.statusCode,
                response.data.data,
                response.data.error,
            );
        } catch (error: any) {
            return this.handleError<T>(error, url, 'POST');
        }
    }

    async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.put<ApiResponseData<T>>(url, data, config);
            return new ApiResponse<T>(
                response.data.success,
                response.data.message,
                response.data.statusCode,
                response.data.data,
                response.data.error,
            );
        } catch (error: any) {
            return this.handleError<T>(error, url, 'PUT');
        }
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
        try {
            const response = await this.client.delete<ApiResponseData<T>>(url, config);
            return new ApiResponse<T>(
                response.data.success,
                response.data.message,
                response.data.statusCode,
                response.data.data,
                response.data.error,
            );
        } catch (error: any) {
            return this.handleError<T>(error, url, 'DELETE');
        }
    }

    private handleError<T>(error: any, url: string, method: string): ApiResponse<T> {
        const statusCode = error.response?.status || 500;
        const errorMessage =
            error.response?.data?.message || error.message || 'Internal Server Error';
        const errorCode = error.response?.data?.error || 'HTTP_ERROR';

        logger.error(`[HttpService] ${method} ${url} failed: ${errorMessage} (${statusCode})`);

        return new ApiResponse<T>(false, errorMessage, statusCode, null, errorCode);
    }
}
