import { NextFunction, Request, Response } from 'express';
import { AuthService } from 'services';
import logger from 'utils/logger';
import { SuccessResponse } from 'response';
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
    logger.info('AuthController instance created');
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      SuccessResponse.CREATED(await this.authService.register(req.body)).send(
        res
      );
    } catch (error) {
      logger.error('Error in AuthController.register:', error);
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      SuccessResponse.OK(await this.authService.login(req.body)).send(res);
    } catch (error) {
      logger.error('Error in AuthController.login:', error);
      next(error);
    }
  }
}
