import 'reflect-metadata';
import express, { Request, Response } from 'express';
import process from 'process';
import morgan from 'morgan';
import helmet from 'helmet';
import initDatabase from 'database/init.database';
import { initKafka } from 'kafka/kafkaClient';
import logger from 'utils/logger';
import router from 'routes';
import { errorHandler, notFound } from 'middleware/errorHandler';
import { requestLogger } from 'middleware/loggerHandler';
import appConfig from 'config/app.config';
import { gatewayAPIKeyHandler } from 'middleware/authHandler';
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
initKafka()
    .then(() => logger.info('Kafka initialized successfully'))
    .catch((error) => {
        logger.error('Error initializing Kafka:', error);
        process.exit(1);
    });

// INIT LOGGER
app.use(requestLogger);
// API KEY HANDLER
// app.use(gatewayAPIKeyHandler);
// ROUTES
app.use(ROUTER_PREFIX, router);

app.get('/health', (req: Request, res: Response) => {
    return res.status(200).json({
        status: 'success',
        data: {
            name: appConfig.app.name,
            environment: appConfig.nodeEnv,
            prefix: ROUTER_PREFIX,
        },
        message: 'API Gateway is running',
    });
});

// ERROR HANDLING
app.use(notFound);

// CATCH ALL UNHANDLED ERRORS
app.use(errorHandler);

const PORT = appConfig.app.port;
app.listen(PORT, () => {
    logger.info(`Auth Service is running on port ${PORT}`);
});
