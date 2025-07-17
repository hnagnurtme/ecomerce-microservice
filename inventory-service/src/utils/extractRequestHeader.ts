import { Request } from 'express';
import { HEADER } from './constant';

export interface ExtractedHeaders {
    apiKey?: string;
    authorization?: string;
    clientId?: string;
    refreshToken?: string;
}

export const extractRequestHeader = (req: Request): ExtractedHeaders => {
    return {
        apiKey: req.headers[HEADER.API_KEY]?.toString(),
        authorization: req.headers[HEADER.AUTHORIZATION]?.toString(),
        clientId: req.headers[HEADER.CLIENT_ID]?.toString(),
        refreshToken: req.headers[HEADER.REFRESH_TOKEN]?.toString(),
    };
};
