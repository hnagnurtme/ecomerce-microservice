import { Router } from 'express';
import authRouter from './auth.routes';
import healthRouter from './healcheck.routes';
import tokenRouter from './token.route';
const router = Router();

router.use('/auth', authRouter);
router.use('/health', healthRouter);
router.use('/tokens', tokenRouter);
export default router;
