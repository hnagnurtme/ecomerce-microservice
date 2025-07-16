import { Router } from 'express';
import userRouter from './user.routes';
import healthRouter from './healcheck.routes';
const router = Router();

router.use('/users', userRouter);
router.use('/health', healthRouter);

export default router;
