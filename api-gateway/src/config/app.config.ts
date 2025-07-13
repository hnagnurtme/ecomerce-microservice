import env from 'utils/exportenv';

const development = {
    app: {
        name: env('DEV_APP_NAME', 'api-gateway'),
        port: env('DEV_APP_PORT', 3000),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
    },
    jwt: {
        secret: env('JWT_SECRET', '1234567890'),
        accessExpiration: env('JWT_ACCESS_EXPIRATION', '1d'),
        refreshExpiration: env('JWT_REFRESH_EXPIRATION', '30d'),
    },
    db: {
        host: env('HOST', 'localhost'),
        port: env('DB_PORT', 27017),
        database: env('DB_NAME', 'shopify-ecommerce'),
        username: env('DB_USER', 'root'),
        password: env('DB_PASS', 'secret'),
        dialect: env('DB_DIALECT', 'mongodb'),
    },
    nodeEnv: env('NODE_ENV', 'development'),
    serviceUrls: {
        AUTH_SERVICE_URL: env('AUTH_SERVICE_URL', 'http://auth-service:3001'),
    },
};
const production = {
    app: {
        name: env('DEV_APP_NAME', 'api-gateway'),
        port: env('DEV_APP_PORT', 8080),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
    },
    jwt: {
        secret: env('JWT_SECRET', '123456789'),
        accessExpiration: env('JWT_ACCESS_EXPIRATION', '1d'),
        refreshExpiration: env('JWT_REFRESH_EXPIRATION', '30d'),
    },
    db: {
        host: env('HOST', 'localhost'),
        port: env('DB_PORT', 27017),
        database: env('DB_NAME', 'shopify-ecommerce'),
        username: env('DB_USER', 'root'),
        password: env('DB_PASS', 'secret'),
        dialect: env('DB_DIALECT', 'mongodb'),
    },
    serviceUrls: {
        AUTH_SERVICE_URL: env('AUTH_SERVICE_URL', 'http://auth-service:3001'),
    },
    nodeEnv: env('NODE_ENV', 'development'),
};

const config = { development, production };
const node = env('NODE_ENV', 'development') as keyof typeof config;
export default config[node];
