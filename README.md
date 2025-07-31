# E-commerce Microservice Architecture

A modern, scalable e-commerce system built with Node.js, TypeScript, Kafka, MongoDB, and
Elasticsearch, following a microservices architecture.

## 📋 Table of Contents

- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Running the Application](#running-the-application)
- [Services](#services)
- [API Documentation](#api-documentation)
- [Monitoring & Logging](#monitoring--logging)
- [Development Workflow](#development-workflow)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## 🏗️ System Architecture

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

## 🚀 Technologies Used

**Backend:**

- Node.js (JavaScript runtime)
- Express.js (Web framework)
- TypeScript (Type-safe JavaScript)

**Database & Search:**

- MongoDB (Document database)
- Mongoose (MongoDB ODM)
- Elasticsearch (Search engine)

**Messaging:**

- Apache Kafka (Event streaming platform)
- KafkaJS (Kafka client for Node.js)

**Monitoring & Logging:**

- Kibana (Data visualization)
- Kafka UI (Kafka management interface)
- Winston (Logging library)

**Development Tools:**

- Docker & Docker Compose (Containerization)
- Prettier (Code formatting)
- ESLint (Code linting)
- Husky (Git hooks)
- Commitlint (Commit message linting)

ecommerce-microservice/ ├── api-gateway/ # API Gateway - Route requests to services │ ├── src/ │ │
├── config/ # Configuration files │ │ ├── middleware/ # Custom middleware │ │ ├── proxies/ # Service
proxy configurations │ │ ├── routes/ # API routes │ │ └── utils/ # Utility functions │ ├──
dockerfile # Docker configuration │ └── package.json ├── auth-service/ # Authentication &
Authorization Service │ ├── src/ │ │ ├── controllers/ # Request handlers │ │ ├── models/ # Database
models │ │ ├── services/ # Business logic │ │ ├── kafka/ # Kafka producers/consumers │ │ ├──
routes/ # API routes │ │ └── utils/ # Utility functions │ ├── dockerfile │ └── package.json ├──
user-service/ # User Management Service │ ├── src/ │ │ ├── controllers/ # Request handlers │ │ ├──
models/ # Database models │ │ ├── services/ # Business logic │ │ ├── kafka/ # Kafka
producers/consumers │ │ └── routes/ # API routes │ ├── dockerfile │ └── package.json ├──
catalog-service/ # Product Catalog Service │ ├── src/ │ │ ├── controllers/ # Request handlers │ │
├── models/ # Database models │ │ ├── services/ # Business logic │ │ ├── kafka/ # Kafka
producers/consumers │ │ ├── utils/ # Utility functions (including Elasticsearch) │ │ └── routes/ #
API routes │ ├── dockerfile │ └── package.json ├── docker-compose.yml # Docker services
configuration ├── package.json # Root package configuration ├── .prettierrc # Prettier configuration
├── .eslintrc.js # ESLint configuration ├── commitlint.config.js # Commit message rules └──
tsconfig.base.json # Shared TypeScript configuration

## 📁 Project Structure

```
ecommerce-microservice/
├── api-gateway/              # API Gateway - routes requests to services
│   ├── src/
│   │   ├── config/           # Configuration files
│   │   ├── middleware/       # Custom middleware
│   │   ├── proxies/          # Service proxy configs
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utility functions
│   ├── dockerfile            # Docker configuration
│   └── package.json
├── auth-service/             # Authentication & Authorization Service
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database models
│   │   ├── services/         # Business logic
│   │   ├── kafka/            # Kafka producers/consumers
│   │   ├── routes/           # API routes
│   │   └── utils/            # Utility functions
│   ├── dockerfile
│   └── package.json
├── user-service/             # User Management Service
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database models
│   │   ├── services/         # Business logic
│   │   ├── kafka/            # Kafka producers/consumers
│   │   └── routes/           # API routes
│   ├── dockerfile
│   └── package.json
├── catalog-service/          # Product Catalog Service
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   ├── models/           # Database models
│   │   ├── services/         # Business logic
│   │   ├── kafka/            # Kafka producers/consumers
│   │   ├── utils/            # Utility functions (Elasticsearch)
│   │   └── routes/           # API routes
│   ├── dockerfile
│   └── package.json
├── docker-compose.yml        # Docker Compose configuration
├── package.json              # Root package configuration
├── .prettierrc               # Prettier configuration
├── .eslintrc.js              # ESLint configuration
├── commitlint.config.js      # Commit message rules
└── tsconfig.base.json        # Shared TypeScript config
```

## 🛠️ Installation Guide

### Prerequisites

- Node.js >= 18.0.0
- Docker >= 20.0.0
- Docker Compose >= 2.0.0
- Git

### Steps

1. **Clone the repository:**
    ```bash
    git clone https://github.com/hnagnurtme/ecomerce-microservice.git
    cd ecomerce-microservice
    ```
2. **Install root dependencies:**
    ```bash
    npm install
    ```
3. **Install dependencies for each service:**

    ```bash
    # Install for all services
    npm run install:all

    # Or install individually
    cd auth-service && npm install
    cd ../user-service && npm install
    cd ../catalog-service && npm install
    cd ../api-gateway && npm install
    ```

## 🚀 Running the Application

### Using Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Start and view logs
docker-compose up

# Start specific services
docker-compose up auth-service user-service

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Running Services Individually

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

- **Purpose:** Routes requests, handles authentication middleware, and rate limiting.
- **Base URL:** `http://localhost:3000`
- **Health Check:** `GET /health`

### Auth Service (Port 3001)

- **Purpose:** Handles user authentication, JWT token management, and user registration/login.
- **Database:** MongoDB (`auth-database`)
- **Kafka Topics:** User events
- **Endpoints:**
    - `POST /auth/register` – Register a new user
    - `POST /auth/login` – User login
    - `POST /auth/refresh` – Refresh JWT token
    - `GET /auth/profile` – Retrieve user profile

### User Service (Port 3002)

- **Purpose:** Manages user profiles and user data operations.
- **Database:** MongoDB (`user-database`)
- **Kafka Topics:** User profile events
- **Endpoints:**
    - `GET /users/profile` – Get user profile
    - `PUT /users/profile` – Update user profile
    - `DELETE /users/profile` – Delete user profile

### Catalog Service (Port 3003)

- **Purpose:** Product catalog management and search functionality.
- **Database:** MongoDB (`catalog-database`)
- **Search Engine:** Elasticsearch
- **Kafka Topics:** Product events
- **Endpoints:**
    - `GET /products` – Get products list
    - `POST /products` – Create product
    - `GET /products/:id` – Get product details
    - `PUT /products/:id` – Update product
    - `DELETE /products/:id` – Delete product
    - `GET /products/search` – Search products

### Infrastructure Services

#### MongoDB (Port 27017)

- **Purpose:** Document database for all services
- **Credentials:** root/secret
- **Databases:** auth-database, user-database, catalog-database

#### Apache Kafka (Port 9092)

- **Purpose:** Event streaming between services
- **Zookeeper:** Service coordination
- **Kafka UI:** `http://localhost:8080`

#### Elasticsearch (Port 9200)

- **Purpose:** Full-text search for catalog service
- **Version:** 8.13.0
- **Endpoint:** `http://localhost:9200`

#### Kibana (Port 5601)

- **Purpose:** Data visualization for Elasticsearch
- **Dashboard:** `http://localhost:5601`

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

- **Application logs:** Winston logging in each service
- **Container logs:** `docker-compose logs [service-name]`
- **Real-time logs:** `docker-compose logs -f [service-name]`

### Health Checks

- **MongoDB:** Connection ping
- **Kafka:** Topic listing
- **Elasticsearch:** Cluster health

### Monitoring Endpoints

- **Kafka UI:** `http://localhost:8080`
- **Kibana:** `http://localhost:5601`
- **Elasticsearch:** `http://localhost:9200/_cluster/health`

docs: update API documentation

## 💻 Development Workflow

### Code Quality Tools

```bash
# Lint all code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type checking
npm run type-check
```

### Git Workflow

1. **Create a new branch:**
    ```bash
    git checkout -b feature/your-feature-name
    ```
2. **Development:**

    ```bash
    # Start required services
    docker-compose up -d mongodb kafka elasticsearch

    # Start developing your service
    cd [service-name]
    npm run dev
    ```

3. **Commit changes:**
    ```bash
    git add .
    npm run commit  # Interactive commit with Commitizen
    ```
4. **Push and create Pull Request:**
    ```bash
    git push origin feature/your-feature-name
    ```

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation update
- `style`: Formatting, missing semicolons, etc
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Build tasks, package updates, etc

**Examples:**

```bash
feat(auth): add user registration endpoint
fix(catalog): resolve elasticsearch connection issue
docs: update API documentation
refactor(user): improve user service architecture
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Service not starting

```bash
# Check logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]

# Rebuild container
docker-compose build [service-name]
```

#### 2. Database connection issues

```bash
# Check MongoDB health
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Restart MongoDB
docker-compose restart mongodb
```

#### 3. Kafka connection issues

```bash
# Check Kafka health
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list

# Restart Kafka cluster
docker-compose restart zookeeper kafka
```

#### 4. Elasticsearch connection issues

```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health

# Restart Elasticsearch
docker-compose restart elasticsearch
```

#### 5. Port conflicts

```bash
# Check used ports
lsof -i :3000  # or another port
netstat -tlnp | grep :3000

# Stop service using the port
docker-compose down
```

### Performance Optimization

#### 1. Docker Performance

```bash
# Remove unused containers and images
docker system prune -a

# Monitor resource usage
docker stats
```

#### 2. Database Performance

```bash
# MongoDB performance monitoring
docker-compose exec mongodb mongostat
```

### Development Tips

1. **Hot reload:** Use `npm run dev` for auto-restart on changes
2. **Debug:** Use VS Code debugger with attach to container
3. **Testing:** Run integration tests with Docker Compose
4. **Environment:** Use `.env` files for each service

## 📝 License

ISC

---

**Developed by:** Your Team Name  
**Version:** 1.0.0  
**Last Updated:** July 2025
