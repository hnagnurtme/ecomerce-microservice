import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'service/auth.service';

export const authenciation = (req: Request, res: Response, next: NextFunction) => {
    const authService = new AuthService();
    return authService.authenciation(req, res, next);
};
