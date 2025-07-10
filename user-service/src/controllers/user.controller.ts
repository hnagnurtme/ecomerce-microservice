import { NextFunction, Request, Response } from 'express';
import { UserService } from 'services';
import logger from 'utils/logger';
import { SuccessResponse } from 'response';
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
    logger.info('UserController instance created');
  }

  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      SuccessResponse.CREATED(await this.userService.creatUser(req.body)).send(
        res
      );
    } catch (error) {
      logger.error('Error in UserController.createUser:', error);
      next(error);
    }
  }
}
