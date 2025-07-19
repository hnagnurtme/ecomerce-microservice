import { Router } from 'express';
import healthRouter from './healcheck.routes';
import cartRouter from './cart.routes';
const router = Router();

router.use('/carts', cartRouter);
router.use('/health', healthRouter);

export default router;
