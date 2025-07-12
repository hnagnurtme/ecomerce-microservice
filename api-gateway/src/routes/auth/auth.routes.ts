// src/routes/auth.routes.ts
import { Router } from 'express';
import { createServiceProxy } from 'proxies/ProxyFactory';

const authRouter = Router();
const AUTH_SERVICE_URL = 'http://auth-service:3001';

authRouter.use('/register', createServiceProxy(AUTH_SERVICE_URL));

export default authRouter;
