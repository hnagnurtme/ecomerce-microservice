import env from 'utils/exportenv';

const development = {
    app: {
        name: env('DEV_APP_NAME', 'api-gateway'),
        port: env('DEV_APP_PORT', 3000),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
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
        USER_SERVICE_URL: env('USER_SERVICE_URL', 'http://user-service:3002'),
        CATALOG_SERVICE_URL: env('CATALOG_SERVICE_URL', 'http://catalog-service:3003'),
    },
    apiKey: {
        gateway: env('API_KEY_GATEWAY', '123456789'),
    },
};
const production = {
    app: {
        name: env('DEV_APP_NAME', 'api-gateway'),
        port: env('DEV_APP_PORT', 8080),
        prefix: env('DEV_ROUTER_PREFIX', '/api/v1'),
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
        USER_SERVICE_URL: env('USER_SERVICE_URL', 'http://user-service:3002'),
        CATALOG_SERVICE_URL: env('CATALOG_SERVICE_URL', 'http://catalog-service:3003'),
    },
    apiKey: {
        gateway: env('API_KEY_GATEWAY', '123456789'),
    },
    nodeEnv: env('NODE_ENV', 'development'),
};

const config = { development, production };
const node = env('NODE_ENV', 'development') as keyof typeof config;
export default config[node];
