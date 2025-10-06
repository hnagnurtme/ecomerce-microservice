# 🛒 E-Commerce Microservice Platform

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![Kafka](https://img.shields.io/badge/Kafka-231F20?style=flat-square&logo=apachekafka&logoColor=white)](https://kafka.apache.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Elasticsearch](https://img.shields.io/badge/Elasticsearch-005571?style=flat-square&logo=elasticsearch&logoColor=white)](https://www.elastic.co/elasticsearch)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white)](https://redis.io/)
[![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazon-aws&logoColor=white)](https://aws.amazon.com/)
[![CI/CD](https://img.shields.io/badge/CI/CD-blue?style=flat-square)]()

> **E-commerce platform built with ExpressJS (TypeScript) microservices**  
> Features: Kafka, Elasticsearch, Redis, MongoDB, CI/CD pipelines, AWS deployment.

## 📋 Mục lục

- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Hướng dẫn cài đặt](#hướng-dẫn-cài-đặt)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Services](#services)
- [API Documentation](#api-documentation)
- [Monitoring & Logging](#monitoring--logging)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client Apps   │    │   Load Balancer │    │   API Gateway   │
│                 │───▶│                 │───▶│   (Port 3000)   │
│ Web/Mobile/etc  │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                ┌───────────────────────────────────────┴───────────────────────────────────────┐
                │                                                                               │
                ▼                               ▼                               ▼
    ┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
    │  Auth Service   │               │  User Service   │               │ Catalog Service │
    │  (Port 3001)    │               │  (Port 3002)    │               │  (Port 3003)    │
    └─────────────────┘               └─────────────────┘               └─────────────────┘
                │                               │                               │
                └───────────────────────────────┼───────────────────────────────┘
                                                │
                                                ▼
                                    ┌─────────────────┐
                                    │ Message Broker  │
                                    │ Apache Kafka    │
                                    │ (Port 9092)     │
                                    └─────────────────┘
                                                │
                ┌───────────────────────────────┼───────────────────────────────┐
                │                               │                               │
                ▼                               ▼                               ▼
    ┌─────────────────┐               ┌─────────────────┐               ┌─────────────────┐
    │    MongoDB      │               │ Elasticsearch   │               │     Kibana      │
    │  (Port 27017)   │               │  (Port 9200)    │               │  (Port 5601)    │
    └─────────────────┘               └─────────────────┘               └─────────────────┘
```

## 🚀 Công nghệ sử dụng

### Backend Framework

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript

### Database & Search

- **MongoDB** - Document database
- **Elasticsearch** - Search engine
- **Mongoose** - MongoDB ODM

### Message Broker

- **Apache Kafka** - Event streaming platform
- **KafkaJS** - Kafka client for Node.js

### Monitoring & Visualization

- **Kibana** - Data visualization
- **Kafka UI** - Kafka management interface
- **Winston** - Logging library

### Development Tools

- **Docker & Docker Compose** - Containerization
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Husky** - Git hooks
- **Commitlint** - Commit message linting

## 📁 Cấu trúc dự án

```
ecommerce-microservice/
├── api-gateway/              # API Gateway - Route requests to services
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── middleware/      # Custom middleware
│   │   ├── proxies/         # Service proxy configurations
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   ├── dockerfile           # Docker configuration
│   └── package.json
├── auth-service/            # Authentication & Authorization Service
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── kafka/           # Kafka producers/consumers
│   │   ├── routes/          # API routes
│   │   └── utils/           # Utility functions
│   ├── dockerfile
│   └── package.json
├── user-service/            # User Management Service
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── kafka/           # Kafka producers/consumers
│   │   └── routes/          # API routes
│   ├── dockerfile
│   └── package.json
├── catalog-service/         # Product Catalog Service
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── kafka/           # Kafka producers/consumers
│   │   ├── utils/           # Utility functions (including Elasticsearch)
│   │   └── routes/          # API routes
│   ├── dockerfile
│   └── package.json
├── docker-compose.yml       # Docker services configuration
├── package.json            # Root package configuration
├── .prettierrc             # Prettier configuration
├── .eslintrc.js            # ESLint configuration
├── commitlint.config.js    # Commit message rules
└── tsconfig.base.json      # Shared TypeScript configuration
```

## 🛠️ Hướng dẫn cài đặt

### Yêu cầu hệ thống

- **Node.js** >= 18.0.0
- **Docker** >= 20.0.0
- **Docker Compose** >= 2.0.0
- **Git**

### Cài đặt

1. **Clone repository:**

    ```bash
    git clone https://github.com/hnagnurtme/ecomerce-microservice.git
    cd ecomerce-microservice
    ```

2. **Cài đặt dependencies:**

    ```bash
    npm install
    ```

3. **Cài đặt dependencies cho từng service:**

    ```bash
    # Cài đặt cho tất cả services
    npm run install:all

    # Hoặc cài đặt riêng cho từng service
    cd auth-service && npm install
    cd ../user-service && npm install
    cd ../catalog-service && npm install
    cd ../api-gateway && npm install
    ```

## 🚀 Chạy ứng dụng

### Sử dụng Docker Compose (Khuyến nghị)

```bash
# Khởi động tất cả services
docker-compose up -d

# Khởi động và theo dõi logs
docker-compose up

# Khởi động service cụ thể
docker-compose up auth-service user-service

# Dừng tất cả services
docker-compose down

# Dừng và xóa volumes
docker-compose down -v
```

### Chạy từng service riêng lẻ

```bash
# Auth Service
cd auth-service
npm run dev

# User Service
cd user-service
npm run dev

# Catalog Service
cd catalog-service
npm run dev

# API Gateway
cd api-gateway
npm run dev
```

## 📊 Services

### API Gateway (Port 3000)

- **Chức năng**: Routing requests, Authentication middleware, Rate limiting
- **Endpoint**: `http://localhost:3000`
- **Health Check**: `GET /health`

### Auth Service (Port 3001)

- **Chức năng**: User authentication, JWT token management, User registration/login
- **Database**: MongoDB (auth-database)
- **Kafka Topics**: User events
- **Endpoints**:
    - `POST /auth/register` - User registration
    - `POST /auth/login` - User login
    - `POST /auth/refresh` - Refresh token
    - `GET /auth/profile` - Get user profile

### User Service (Port 3002)

- **Chức năng**: User profile management, User data operations
- **Database**: MongoDB (user-database)
- **Kafka Topics**: User profile events
- **Endpoints**:
    - `GET /users/profile` - Get user profile
    - `PUT /users/profile` - Update user profile
    - `DELETE /users/profile` - Delete user profile

### Catalog Service (Port 3003)

- **Chức năng**: Product catalog management, Search functionality
- **Database**: MongoDB (catalog-database)
- **Search Engine**: Elasticsearch
- **Kafka Topics**: Product events
- **Endpoints**:
    - `GET /products` - Get products list
    - `POST /products` - Create product
    - `GET /products/:id` - Get product details
    - `PUT /products/:id` - Update product
    - `DELETE /products/:id` - Delete product
    - `GET /products/search` - Search products

### Infrastructure Services

#### MongoDB (Port 27017)

- **Database**: Document database cho tất cả services
- **Credentials**: root/secret
- **Databases**: auth-database, user-database, catalog-database

#### Apache Kafka (Port 9092)

- **Message Broker**: Event streaming giữa các services
- **Zookeeper**: Service coordination
- **Kafka UI**: `http://localhost:8080`

#### Elasticsearch (Port 9200)

- **Search Engine**: Full-text search cho catalog service
- **Version**: 8.13.0
- **Endpoint**: `http://localhost:9200`

#### Kibana (Port 5601)

- **Visualization**: Data visualization cho Elasticsearch
- **Dashboard**: `http://localhost:5601`

## 📚 API Documentation

### Authentication Flow

```
1. User Registration/Login → Auth Service
2. JWT Token Generation → Auth Service
3. Token Validation → API Gateway Middleware
4. Request Routing → Target Service
```

### Event Flow (Kafka)

```
1. User Registration → Auth Service → Kafka → User Service
2. Profile Updates → User Service → Kafka → Auth Service
3. Product Events → Catalog Service → Kafka → Search Indexing
```

## 📈 Monitoring & Logging

### Logs

- **Application logs**: Winston logging trong từng service
- **Container logs**: `docker-compose logs [service-name]`
- **Real-time logs**: `docker-compose logs -f [service-name]`

### Health Checks

- **MongoDB**: Connection ping
- **Kafka**: Topic listing
- **Elasticsearch**: Cluster health

### Monitoring Endpoints

- **Kafka UI**: `http://localhost:8080`
- **Kibana**: `http://localhost:5601`
- **Elasticsearch**: `http://localhost:9200/_cluster/health`

## 💻 Development Workflow

### Code Quality Tools

```bash
# Lint tất cả code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### Git Workflow

1. **Tạo branch mới:**

    ```bash
    git checkout -b feature/your-feature-name
    ```

2. **Development:**

    ```bash
    # Chạy services cần thiết
    docker-compose up -d mongodb kafka elasticsearch

    # Chạy service đang phát triển
    cd [service-name]
    npm run dev
    ```

3. **Commit changes:**

    ```bash
    git add .
    npm run commit  # Interactive commit với Commitizen
    ```

4. **Push và tạo Pull Request:**
    ```bash
    git push origin feature/your-feature-name
    ```

### Commit Message Format

Dự án sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: Tính năng mới
- `fix`: Sửa lỗi
- `docs`: Cập nhật tài liệu
- `style`: Formatting, missing semi colons, etc
- `refactor`: Refactoring code
- `test`: Adding tests
- `chore`: Updating build tasks, packages, etc

**Examples:**

```bash
feat(auth): add user registration endpoint
fix(catalog): resolve elasticsearch connection issue
docs: update API documentation
refactor(user): improve user service architecture
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Service không khởi động được

```bash
# Kiểm tra logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild container
docker-compose build [service-name]
```

#### 2. Database connection issues

```bash
# Kiểm tra MongoDB health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB
docker-compose restart mongodb
```

#### 3. Kafka connection issues

```bash
# Kiểm tra Kafka health
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Restart Kafka cluster
docker-compose restart zookeeper kafka
```

#### 4. Elasticsearch connection issues

```bash
# Kiểm tra Elasticsearch health
curl http://localhost:9200/_cluster/health

# Restart Elasticsearch
docker-compose restart elasticsearch
```

#### 5. Port conflicts

```bash
# Kiểm tra ports đang sử dụng
lsof -i :3000  # hoặc port khác
netstat -tlnp | grep :3000

# Dừng service sử dụng port
docker-compose down
```

### Performance Optimization

#### 1. Docker Performance

```bash
# Xóa unused containers và images
docker system prune -a

# Monitoring resource usage
docker stats
```

#### 2. Database Performance

```bash
# MongoDB performance monitoring
docker-compose exec mongodb mongostat
```

### Development Tips

1. **Hot reload**: Sử dụng `npm run dev` để auto-restart khi có thay đổi
2. **Debug**: Sử dụng VS Code debugger với attach to container
3. **Testing**: Chạy integration tests với Docker Compose
4. **Environment**: Sử dụng `.env` files cho từng service

## 📝 License

ISC

---

**Developed by:** Your Team Name  
**Version:** 1.0.0  
**Last Updated:** July 2025
