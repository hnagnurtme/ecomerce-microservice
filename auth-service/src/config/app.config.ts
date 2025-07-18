import env from 'utils/exportenv';

const development = {
    app: {
        name: env('DEV_APP_NAME', 'auth-service'),
        port: env('DEV_APP_PORT', 3001),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
    },
    jwt: {
        secret: env('JWT_SECRET', ''),
        accessExpiration: env('JWT_ACCESS_EXPIRATION', '1d'),
        refreshExpiration: env('JWT_REFRESH_EXPIRATION', '30d'),
    },
    db: {
        host: env('HOST', 'localhost'),
        port: env('DB_PORT', 27017),
        database: env('DB_NAME', 'auth-database'),
        username: env('DB_USER', 'root'),
        password: env('DB_PASS', 'secret'),
        dialect: env('DB_DIALECT', 'mongodb'),
    },
    kafka: {
        brokers: env('KAFKA_BROKERS', 'localhost:9092'),
    },
    apiKey: {
        gateway: env('API_KEY_GATEWAY', '123456789'),
    },
    nodeEnv: env('NODE_ENV', 'development'),
};
const production = {
    app: {
        name: env('DEV_APP_NAME', 'auth-service'),
        port: env('DEV_APP_PORT', 8080),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
    },
    jwt: {
        secret: env('JWT_SECRET', 'gdscdut'),
        accessExpiration: env('JWT_ACCESS_EXPIRATION', '1d'),
        refreshExpiration: env('JWT_REFRESH_EXPIRATION', '30d'),
    },
    db: {
        host: env('HOST', 'localhost'),
        port: env('DB_PORT', 27017),
        database: env('DB_NAME', 'auth-database'),
        username: env('DB_USER', 'root'),
        password: env('DB_PASS', 'secret'),
        dialect: env('DB_DIALECT', 'mongodb'),
    },
    kafka: {
        brokers: env('KAFKA_BROKERS', 'localhost:9092'),
    },
    apiKey: {
        gateway: env('API_KEY_GATEWAY', '123456789'),
    },
    nodeEnv: env('NODE_ENV', 'development'),
};

const config = { development, production };
const node = env('NODE_ENV', 'development') as keyof typeof config;
export default config[node];
