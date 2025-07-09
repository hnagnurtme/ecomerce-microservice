import { Router } from 'express';
import asyncHandler from 'middleware/asyncHandler';
import { AuthController } from 'controllers/auth.controller';

const authRouter = Router();
const authController = new AuthController();

// Add endpoints
authRouter.post(
  '/register',
  asyncHandler(authController.register.bind(authController))
);

export default authRouter;
