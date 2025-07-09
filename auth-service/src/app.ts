import express from 'express';
import process from 'process';
import morgan from 'morgan';
import helmet from 'helmet';
import initDatabase from 'database/init.database';
import logger from 'utils/logger';
const app = express();

// INIT MIDDLEWARE
app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INIT DATABASE
initDatabase.connect();

// ROUTES
app.get('/', (req, res) => {
  res.send('Welcome to the Auth Service!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Auth Service is running on port ${PORT}`);
});
