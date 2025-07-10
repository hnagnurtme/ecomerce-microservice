import express from 'express';
import process from 'process';
import morgan from 'morgan';
import helmet from 'helmet';
import initDatabase from 'database/init.database';
import { initKafka } from 'kafka/kafkaClient';
import logger from 'utils/logger';
import router from 'routes';
import { errorHandler, notFound } from 'middleware/errorHandler';
import { listenUserCreated } from 'kafka/consumer/user.consumer';
import appConfig from 'config/app.config';
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
  .catch(error => {
    logger.error('Error initializing Kafka:', error);
    process.exit(1);
  });

// LISTEN TO KAFKA EVENTS

listenUserCreated()
  .then(() => logger.info('Listening to user created events'))
  .catch(error => {
    logger.error('Error listening to user created events:', error);
    process.exit(1);
  });
// ROUTES
app.use(ROUTER_PREFIX, router);

// ERROR HANDLING
app.use(notFound);

// CATCH ALL UNHANDLED ERRORS
app.use(errorHandler);

const PORT = appConfig.app.port;
app.listen(PORT, () => {
  logger.info(`Auth Service is running on port ${PORT}`);
});
