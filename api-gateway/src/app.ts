// index.ts hoặc app.ts
import express, { Request, Response } from 'express';
import routes from './routes';
import morgan from 'morgan';
import helmet from 'helmet';
import logger from 'utils/logger';
import { SuccessResponse } from 'response';
import { errorHandler, notFound } from 'middleware/errorHandler';
import initDatabase from 'database/init.database';
import { requestLogger } from 'middleware/loggerHandler';
import appConfig from 'config/app.config';
import { authenciation } from 'middleware/authenciation';

const ROUTER_PREFIX = appConfig.app.prefix || '/api/v1';

const app = express();
// INIT MIDDLEWARE
app.use(morgan('dev'));
app.use(helmet());
// INIT DATABASE
initDatabase.connect();
// INIT LOGGER
app.use(requestLogger);

// ROUTES
app.use(ROUTER_PREFIX, routes);
//

app.use(authenciation);

// HEALTH CHECK
app.get('/health', (req: Request, res: Response) => {
    return new SuccessResponse(
        {
            name: appConfig.app.name,
            environment: appConfig.nodeEnv,
            prefix: ROUTER_PREFIX,
        },
        'API Gateway is running',
    ).send(res);
});

// ERROR HANDLING
app.use(notFound);

// CATCH ALL UNHANDLED ERRORS
app.use(errorHandler);

const PORT = appConfig.app.port || 3000;
app.listen(PORT, () => {
    logger.info(`Api Gateway is running on port ${PORT}`);
});
