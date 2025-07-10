import { Router } from 'express';
import asyncHandler from 'middleware/asyncHandler';
import { AuthController } from 'controllers/auth.controller';
import { registerSchema } from 'schemas/auth.schema';
import { validate } from 'middleware/validate';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/register',
  validate(registerSchema),
  asyncHandler(authController.register.bind(authController))
);

export default authRouter;
