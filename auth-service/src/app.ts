import express from 'express';
import process from 'process';
import morgan from 'morgan';
import helmet from 'helmet';
import initDatabase from 'database/init.database';
import logger from 'utils/logger';
import router from 'routes';
import { errorHandler, notFound } from 'middleware/errorHandler';
const app = express();

// INIT MIDDLEWARE
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INIT DATABASE
initDatabase.connect();

// ROUTES
app.use('', router);

// ERROR HANDLING
app.use(notFound);
// CATCH ALL UNHANDLED ERRORS

app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Auth Service is running on port ${PORT}`);
});
