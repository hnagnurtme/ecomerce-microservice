import type { Request as ExpressRequest } from 'express';

export interface AuthenticatedRequest extends ExpressRequest {
    user?: {
        userId: string;
        email: string;
        roles: string[];
    };
    keyToken?: {
        publicKey: string;
        refreshToken: string;
    };
}
