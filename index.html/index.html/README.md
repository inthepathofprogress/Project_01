# Suvida E-Commerce Microservices Application

A complete microservices-based e-commerce platform built with Java Spring Boot and Next.js.

## Architecture

This application follows a microservices architecture with the following services:

### Backend Services (Spring Boot)
1. **API Gateway** (Port: 8080) - Entry point for all client requests
2. **Service Registry** (Port: 8761) - Eureka server for service discovery
3. **User Service** (Port: 8081) - User authentication and profile management
4. **Product Service** (Port: 8082) - Product catalog and inventory management
5. **Cart Service** (Port: 8083) - Shopping cart management
6. **Order Service** (Port: 8084) - Order processing and history
7. **Payment Service** (Port: 8085) - Fake payment gateway integration

### Frontend
- **Next.js Application** (Port: 3000) - Customer-facing e-commerce UI with admin panel

## Technology Stack

### Backend
- Java 17
- Spring Boot 3.1.x
- Spring Cloud (Gateway, Eureka, Config)
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL
- Redis (for cart caching)
- Maven

### Frontend
- Next.js 14
- React 18
- TypeScript
- Bootstrap 5
- Axios
- React Query

## Prerequisites

- Java 17 or higher
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis (optional, for cart caching)
- Docker & Docker Compose
- Maven 3.8+

## Local Development Setup

### 1. Clone and Navigate
```bash
cd C:\Users\6896232\HobbyProjects\suvida
```

### 2. Start Infrastructure Services
```bash
docker-compose up -d postgres redis
```

### 3. Start Backend Services (in order)
```bash
# Start Service Registry first
cd service-registry
mvn spring-boot:run

# Start other services (in separate terminals)
cd api-gateway
mvn spring-boot:run

cd user-service
mvn spring-boot:run

cd product-service
mvn spring-boot:run

cd cart-service
mvn spring-boot:run

cd order-service
mvn spring-boot:run

cd payment-service
mvn spring-boot:run
```

### 4. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8080
- Service Registry: http://localhost:8761

## Quick Start with Docker

```bash
docker-compose up --build
```

## Default Credentials

### Admin User
- Email: admin@suvida.com
- Password: admin123

### Test User
- Email: user@suvida.com
- Password: user123

## API Documentation

Once services are running, access Swagger UI:
- User Service: http://localhost:8081/swagger-ui.html
- Product Service: http://localhost:8082/swagger-ui.html
- Cart Service: http://localhost:8083/swagger-ui.html
- Order Service: http://localhost:8084/swagger-ui.html
- Payment Service: http://localhost:8085/swagger-ui.html

## AWS Deployment

### Using Docker & ECS

1. Build and push images to ECR:
```bash
./deploy/build-and-push.sh
```

2. Deploy using CloudFormation or ECS CLI:
```bash
cd deploy/aws
./deploy-ecs.sh
```

See [deployment documentation](./deploy/README.md) for detailed instructions.

## Features

### Customer Features
- User registration and authentication
- Browse products with search and filters
- Add products to cart
- Checkout with fake payment
- View order history
- User profile management

### Admin Features
- Product management (CRUD)
- Inventory management
- Order management
- User management
- Dashboard with analytics

## Project Structure

```
suvida/
├── service-registry/      # Eureka Server
├── api-gateway/          # Spring Cloud Gateway
├── user-service/         # User & Auth
├── product-service/      # Products & Inventory
├── cart-service/         # Shopping Cart
├── order-service/        # Orders
├── payment-service/      # Fake Payment Gateway
├── frontend/             # Next.js UI
├── deploy/               # Deployment scripts
├── docker-compose.yml    # Local development
└── pom.xml              # Parent POM
```

## Development Guidelines

- Each microservice is independently deployable
- Services communicate via REST APIs
- JWT tokens for authentication
- Database per service pattern
- Use Feign clients for inter-service communication

## Testing

```bash
# Run tests for all services
mvn clean test

# Run tests for specific service
cd user-service
mvn test

# Frontend tests
cd frontend
npm test
```

## License

MIT License - This is a college project for educational purposes.

## Contributors

College Project - Suvida E-Commerce Platform

