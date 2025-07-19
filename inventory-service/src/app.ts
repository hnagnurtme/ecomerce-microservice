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
import { ProductConsumer } from 'kafka/consumer/product.comsumer';
import { initKafka } from 'kafka/kafkaClient';
import { InventoryService } from 'services';
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

// // API KEY HANDLER
app.use(gatewayAPIKeyHandler);
// // ROUTES
app.use(ROUTER_PREFIX, router);

// ERROR HANDLING
app.use(notFound);

// CATCH ALL UNHANDLED ERRORS
app.use(errorHandler);

// Initialize ProductConsumer with InventoryService
ProductConsumer.initialize(new InventoryService());
// Start listening for product created events
ProductConsumer.listenCreatedProduct()
    .then(() => logger.info('ProductConsumer is listening for product created events'))
    .catch((error) => {
        logger.error('Error starting ProductConsumer:', error);
        process.exit(1);
    });

const PORT = appConfig.app.port;
app.listen(PORT, () => {
    logger.info(`Auth Service is running on port ${PORT}`);
});
