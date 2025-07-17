import { Router } from 'express';
import healthRouter from './healcheck.routes';
import inventoryRouter from './inventory.routes';
const router = Router();

router.use('/inventories', inventoryRouter);
router.use('/health', healthRouter);

export default router;
