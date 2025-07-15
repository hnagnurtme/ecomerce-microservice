import mongoose from 'mongoose';
import config from 'config/app.config';
import logger from 'utils/logger';
const {
    db: { host, database: name, port, username, password },
    nodeEnv,
} = config;

class Database {
    private static instance: Database;

    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        Database.instance = this;
        logger.info('Database instance created');
    }

    connect(type = 'mongodb') {
        if (nodeEnv === 'development') {
            mongoose.set('debug', false);
        }
        const uri = `${type}://${username}:${password}@${host}:${port}/${name}?authSource=admin`;

        mongoose
            .connect(uri, {
                maxPoolSize: 10,
            })
            .then(() => {
                logger.info(`Connected to ${type} database at ${uri}`);
            })
            .catch((error: Error) => {
                logger.error(`Error connecting to ${type} database at ${uri}: ${error.message}`);
                process.exit(1);
            });
    }

    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}
export default Database.getInstance();
