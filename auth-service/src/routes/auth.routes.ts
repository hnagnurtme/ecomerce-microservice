import { Router } from 'express';
import asyncHandler from 'middleware/asyncHandler';
import { AuthController } from 'controllers/auth.controller';
import { RegisterDto } from 'dtos/register.dto';
import { validateDto } from 'middleware/validate';
import { LoginDto } from 'dtos';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/register',
  validateDto(RegisterDto),
  asyncHandler(authController.register.bind(authController))
);
authRouter.post(
  '/login',
  validateDto(LoginDto),
  asyncHandler(authController.login.bind(authController))
);
export default authRouter;
