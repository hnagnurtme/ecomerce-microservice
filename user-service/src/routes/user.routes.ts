import { Router } from 'express';
import asyncHandler from 'middleware/asyncHandler';
import { validateDto } from 'middleware/validate';
import { RegisterDto } from 'dtos';
import { UserController } from 'controllers/user.controller';
const userController = new UserController();
const userRouter = Router();

userRouter.post(
    '',
    validateDto(RegisterDto),
    asyncHandler(userController.createUser.bind(userController)),
);
userRouter.get('/:id', asyncHandler(userController.getUserById.bind(userController)));
userRouter.get('', asyncHandler(userController.getUserByEmail.bind(userController)));
export default userRouter;
