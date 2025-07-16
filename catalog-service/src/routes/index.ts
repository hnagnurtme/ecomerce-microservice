import { Router } from 'express';
import productRouter from './product.routes';
import healthRouter from './healcheck.routes';
const router = Router();

router.use('/products', productRouter);
router.use('/health', healthRouter);

export default router;
