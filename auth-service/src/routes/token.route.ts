import { Router } from 'express';
import asyncHandler from 'middleware/asyncHandler';
import { TokenController } from 'controllers/token.controller';

const tokenRouter = Router();
const tokenController = new TokenController();

tokenRouter.get('', asyncHandler(tokenController.getTokenByUserId.bind(tokenController)));

export default tokenRouter;
