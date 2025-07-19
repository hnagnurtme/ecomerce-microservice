import 'reflect-metadata';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import initDatabase from 'database/init.database';
import logger from 'utils/logger';
import router from 'routes';
import { errorHandler, notFound } from 'middleware/errorHandler';
import appConfig from 'config/app.config';
import { gatewayAPIKeyHandler } from 'utils/authHandler';
const ROUTER_PREFIX = appConfig.app.prefix || '/api/v1';
const app = express();

// INIT MIDDLEWARE
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INIT DATABASE
initDatabase.connect();
// INIT KAFKA

// // // API KEY HANDLER
// app.use(gatewayAPIKeyHandler);
// // ROUTES
app.use(ROUTER_PREFIX, router);

// ERROR HANDLING
app.use(notFound);

// CATCH ALL UNHANDLED ERRORS
app.use(errorHandler);

const PORT = appConfig.app.port;
app.listen(PORT, () => {
    logger.info(`Auth Service is running on port ${PORT}`);
});
