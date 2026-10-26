# Suvida E-Commerce - Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Local Development Setup

- [ ] Java 17+ installed
- [ ] Node.js 18+ installed
- [ ] PostgreSQL 14+ installed
- [ ] Maven 3.8+ installed
- [ ] Docker installed (optional)

### 2. Database Setup

- [ ] PostgreSQL running
- [ ] Run `init-databases.sql` to create all databases
- [ ] Verify all 5 databases created:
  - suvida_users
  - suvida_products
  - suvida_cart
  - suvida_orders
  - suvida_payments

### 3. Backend Services

- [ ] Build parent project: `mvn clean install`
- [ ] Start Service Registry (Port 8761)
- [ ] Wait for Service Registry to be ready
- [ ] Start API Gateway (Port 8080)
- [ ] Start User Service (Port 8081)
- [ ] Start Product Service (Port 8082)
- [ ] Start Cart Service (Port 8083)
- [ ] Start Order Service (Port 8084)
- [ ] Start Payment Service (Port 8085)
- [ ] Verify all services registered in Eureka (http://localhost:8761)

### 4. Frontend Setup

- [ ] Navigate to frontend directory
- [ ] Run `npm install`
- [ ] Create `.env.local` with API URL
- [ ] Start frontend: `npm run dev`
- [ ] Verify frontend loads at http://localhost:3000

### 5. Testing Application

- [ ] Register a new user
- [ ] Login with registered user
- [ ] Browse products (should see seeded products)
- [ ] Add products to cart
- [ ] View cart
- [ ] Proceed to checkout
- [ ] Complete fake payment
- [ ] Verify order appears in "My Orders"

### 6. Admin Setup

- [ ] Register admin user
- [ ] Update user role to ADMIN in database:
  ```sql
  UPDATE users SET role = 'ADMIN' WHERE email = 'admin@suvida.com';
  ```
- [ ] Login as admin
- [ ] Verify "Admin" menu appears
- [ ] Test product CRUD operations
- [ ] View orders dashboard

## 🐳 Docker Deployment Checklist

### 1. Docker Compose Setup

- [ ] Docker Desktop installed and running
- [ ] Run `docker-compose up -d`
- [ ] Wait for all containers to start (may take 2-3 minutes)
- [ ] Check container status: `docker-compose ps`
- [ ] Verify logs: `docker-compose logs -f`

### 2. Verification

- [ ] All containers running
- [ ] PostgreSQL container healthy
- [ ] Service Registry accessible (http://localhost:8761)
- [ ] API Gateway accessible (http://localhost:8080)
- [ ] Frontend accessible (http://localhost:3000)
- [ ] All services registered in Eureka

### 3. Stopping Services

- [ ] Stop containers: `docker-compose down`
- [ ] Remove volumes (if needed): `docker-compose down -v`

## ☁️ AWS Deployment Checklist

### 1. AWS Prerequisites

- [ ] AWS account created
- [ ] AWS CLI installed and configured
- [ ] IAM user with necessary permissions
- [ ] Key pair created for EC2 (if using EC2)

### 2. ECR Setup (Container Registry)

- [ ] Create ECR repositories for all services
- [ ] Login to ECR
- [ ] Build Docker images locally
- [ ] Tag images with ECR URLs
- [ ] Push images to ECR

### 3. RDS Database Setup

- [ ] Create PostgreSQL RDS instance
- [ ] Note down endpoint URL
- [ ] Configure security group for database access
- [ ] Create databases using init script
- [ ] Test connection from local machine

### 4. ECS Deployment (Recommended)

- [ ] Create ECS cluster
- [ ] Create task definitions for each service
- [ ] Update environment variables with RDS endpoint
- [ ] Create ECS services
- [ ] Configure Application Load Balancer
- [ ] Set up target groups
- [ ] Configure health checks
- [ ] Verify services running

### 5. EC2 Deployment (Alternative)

- [ ] Launch EC2 instance (t3.medium or larger)
- [ ] Install Docker and Docker Compose
- [ ] Clone repository to EC2
- [ ] Update docker-compose.yml with RDS endpoint
- [ ] Run `docker-compose up -d`
- [ ] Configure security groups for ports
- [ ] Set up Elastic IP (optional)

### 6. Post-Deployment

- [ ] Test all endpoints
- [ ] Verify frontend loads
- [ ] Test user registration and login
- [ ] Test complete purchase flow
- [ ] Monitor CloudWatch logs
- [ ] Set up CloudWatch alarms
- [ ] Configure auto-scaling (optional)
- [ ] Set up backup for RDS
- [ ] Configure SSL certificate
- [ ] Point domain to load balancer (optional)

## 🔧 Troubleshooting Checklist

### Service Won't Start

- [ ] Check if port is already in use
- [ ] Verify PostgreSQL is running
- [ ] Check database connection in application.properties
- [ ] Review service logs
- [ ] Ensure Service Registry started first

### Database Connection Issues

- [ ] Verify PostgreSQL is running
- [ ] Check database exists
- [ ] Verify credentials in application.properties
- [ ] Check firewall/security group settings
- [ ] Test connection with psql

### Frontend Not Loading

- [ ] Verify API Gateway is running
- [ ] Check NEXT_PUBLIC_API_URL in .env.local
- [ ] Clear browser cache
- [ ] Check browser console for errors
- [ ] Verify CORS configuration

### Payment Fails Every Time

- [ ] This is normal - 10% failure rate is by design
- [ ] Try multiple times
- [ ] Check payment service logs
- [ ] Verify order was created before payment

### Products Not Showing

- [ ] Verify Product Service is running
- [ ] Check if data seeder ran successfully
- [ ] Query products table directly
- [ ] Check API Gateway routing
- [ ] Review browser network tab

## 📊 Performance Checklist

- [ ] Enable connection pooling
- [ ] Configure JVM heap size appropriately
- [ ] Enable caching where applicable
- [ ] Optimize database queries
- [ ] Enable gzip compression
- [ ] Use CDN for static assets (production)
- [ ] Enable database indexing
- [ ] Monitor resource usage

## 🔒 Security Checklist

- [ ] Change default JWT secret
- [ ] Update database passwords
- [ ] Enable HTTPS (production)
- [ ] Configure security groups properly
- [ ] Implement rate limiting (production)
- [ ] Enable database encryption
- [ ] Regular security updates
- [ ] Implement proper logging
- [ ] Set up monitoring and alerts

## 📝 Documentation Checklist

- [ ] README.md reviewed
- [ ] QUICK-START.md followed
- [ ] API endpoints documented
- [ ] Architecture diagram created (optional)
- [ ] Deployment guide reviewed
- [ ] Demo credentials documented
- [ ] Known issues documented

## 🎓 College Project Submission Checklist

- [ ] All features working
- [ ] Code properly formatted
- [ ] Comments added where necessary
- [ ] README complete
- [ ] Screenshots/demo video prepared
- [ ] Architecture explained
- [ ] Technology choices justified
- [ ] Future enhancements listed
- [ ] GitHub repository created (optional)
- [ ] Project report written

---

**Note:** This is a comprehensive checklist. Not all items are mandatory for a college project demo. Focus on core functionality first, then add advanced features if time permits.

