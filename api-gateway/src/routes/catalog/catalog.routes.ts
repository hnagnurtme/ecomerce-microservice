import appConfig from 'config/app.config';
import { Router } from 'express';
import { createServiceProxy } from 'proxies/ProxyFactory';
import { authenciation } from 'middleware/authenciation';
const { CATALOG_SERVICE_URL } = appConfig.serviceUrls;
const catalogServiceUrl: string = CATALOG_SERVICE_URL || 'http://catalog-service:3003';

const catalogRouter = Router();

catalogRouter.use('', authenciation, createServiceProxy(catalogServiceUrl));

export default catalogRouter;
