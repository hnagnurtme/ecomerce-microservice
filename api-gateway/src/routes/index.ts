import { Router } from 'express';
import authRouter from './auth/auth.routes';
import catalogRouter from './catalog/catalog.routes';

const router = Router();

router.use('/auth', authRouter);
router.use('/products', catalogRouter);

export default router;
