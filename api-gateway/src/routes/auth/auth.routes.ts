import appConfig from 'config/app.config';
import { Router } from 'express';
import { createServiceProxy } from 'proxies/ProxyFactory';
const { AUTH_SERVICE_URL } = appConfig.serviceUrls;
const authServiceUrl: string = AUTH_SERVICE_URL || 'http://auth-service:3001';

const authRouter = Router();

authRouter.use('/register', createServiceProxy(authServiceUrl));
authRouter.use('/login', createServiceProxy(authServiceUrl));
export default authRouter;
