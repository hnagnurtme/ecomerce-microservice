import env from 'utils/exportenv';

const development = {
    app: {
        port: env('DEV_APP_PORT', 3003),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
    },
    db: {
        host: env('HOST', 'localhost'),
        port: env('DB_PORT', 27017),
        database: env('DB_NAME', 'catalog-database'),
        username: env('DB_USER', 'root'),
        password: env('DB_PASS', 'secret'),
        dialect: env('DB_DIALECT', 'mongodb'),
    },
    apiKey: {
        gateway: env('API_KEY_GATEWAY', '123456789'),
    },
    nodeEnv: env('NODE_ENV', 'development'),
};
const production = {
    app: {
        port: env('DEV_APP_PORT', 3003),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
    },
    db: {
        host: env('HOST', 'localhost'),
        port: env('DB_PORT', 27017),
        database: env('DB_NAME', 'catalog-database'),
        username: env('DB_USER', 'root'),
        password: env('DB_PASS', 'secret'),
        dialect: env('DB_DIALECT', 'mongodb'),
    },
    apiKey: {
        gateway: env('API_KEY_GATEWAY', '123456789'),
    },
    nodeEnv: env('NODE_ENV', 'development'),
};

const config = { development, production };
const node = env('NODE_ENV', 'development') as keyof typeof config;
export default config[node];
