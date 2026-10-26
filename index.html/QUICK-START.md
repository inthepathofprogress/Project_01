# Suvida E-Commerce - Quick Start Guide

## 🚀 Quick Start (Development)

### Prerequisites
- Java 17 or higher
- Node.js 18+ and npm
- PostgreSQL 14+
- Maven 3.8+
- Docker (optional but recommended)

### Option 1: Using Docker Compose (Easiest)

1. **Start all services**
   ```powershell
   docker-compose up -d
   ```

2. **Access the application**
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080
   - Service Registry: http://localhost:8761

3. **Stop all services**
   ```powershell
   docker-compose down
   ```

### Option 2: Manual Setup

#### Step 1: Setup Databases

Create PostgreSQL databases:
```sql
CREATE DATABASE suvida_users;
CREATE DATABASE suvida_products;
CREATE DATABASE suvida_cart;
CREATE DATABASE suvida_orders;
CREATE DATABASE suvida_payments;
```

Or run the SQL script:
```powershell
psql -U postgres -f init-databases.sql
```

#### Step 2: Start Backend Services

Open separate PowerShell terminals for each service:

**Terminal 1: Service Registry**
```powershell
cd service-registry
mvn spring-boot:run
```

**Terminal 2: API Gateway** (wait for service registry to start)
```powershell
cd api-gateway
mvn spring-boot:run
```

**Terminal 3: User Service**
```powershell
cd user-service
mvn spring-boot:run
```

**Terminal 4: Product Service**
```powershell
cd product-service
mvn spring-boot:run
```

**Terminal 5: Cart Service**
```powershell
cd cart-service
mvn spring-boot:run
```

**Terminal 6: Order Service**
```powershell
cd order-service
mvn spring-boot:run
```

**Terminal 7: Payment Service**
```powershell
cd payment-service
mvn spring-boot:run
```

#### Step 3: Start Frontend

```powershell
cd frontend
npm install
npm run dev
```

## 📝 Testing the Application

### 1. Register a New User
- Go to http://localhost:3000/register
- Fill in the registration form
- You'll be automatically logged in

### 2. Browse Products
- The product service automatically seeds sample products on first run
- Go to http://localhost:3000/products
- Filter by category or search for products

### 3. Add Products to Cart
- Click "Add to Cart" on any product
- View cart at http://localhost:3000/cart

### 4. Place an Order
- Go to cart and click "Checkout"
- Fill in shipping details
- Select payment method (fake payment gateway)

### 5. Test Payment
- The fake payment gateway has a 90% success rate
- If payment fails, try again (it's random for demo purposes)

### 6. View Orders
- Go to "My Orders" from user dropdown
- See order status and details

## 🔐 Default Credentials

### Admin Account
- Email: `admin@suvida.com`
- Password: `admin123`

Note: You need to create this account manually through registration or database insert.

### Test User
- Email: `user@suvida.com`
- Password: `user123`

Note: Create through registration page.

## 🎨 Admin Features

If logged in as admin, you'll see an "Admin" menu option where you can:
- Add new products
- Edit existing products
- Manage inventory
- View all orders
- Update order status

## 🛠️ Development Tools

### View Service Registry Dashboard
http://localhost:8761

Shows all registered microservices and their status.

### API Testing

Use Postman or curl to test APIs directly:

**Login**
```powershell
curl -X POST http://localhost:8080/api/users/login `
  -H "Content-Type: application/json" `
  -d '{"email":"user@suvida.com","password":"user123"}'
```

**Get Products**
```powershell
curl http://localhost:8080/api/products
```

**Get Cart (requires auth token)**
```powershell
curl http://localhost:8080/api/cart/user/1 `
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🐛 Troubleshooting

### Database Connection Error
1. Ensure PostgreSQL is running: `Get-Service postgresql*`
2. Check database credentials in `application.properties`
3. Verify databases exist: `psql -U postgres -l`

### Service Not Registering with Eureka
1. Ensure Service Registry is running first
2. Wait 30 seconds for services to register
3. Check Eureka dashboard at http://localhost:8761

### Port Already in Use
If you get "port already in use" error:
```powershell
# Find process using port (e.g., 8080)
netstat -ano | findstr :8080

# Kill the process
taskkill /PID <PID> /F
```

### Frontend Not Loading
1. Clear npm cache: `npm cache clean --force`
2. Delete node_modules: `rm -r node_modules`
3. Reinstall: `npm install`

### Maven Build Fails
1. Clear Maven cache: `mvn clean`
2. Update dependencies: `mvn clean install`
3. Check Java version: `java -version` (should be 17+)

## 📊 Project Structure

```
suvida/
├── service-registry/      # Eureka Server (Port 8761)
├── api-gateway/          # Spring Cloud Gateway (Port 8080)
├── user-service/         # User & Authentication (Port 8081)
├── product-service/      # Products & Inventory (Port 8082)
├── cart-service/         # Shopping Cart (Port 8083)
├── order-service/        # Order Management (Port 8084)
├── payment-service/      # Fake Payment Gateway (Port 8085)
├── frontend/             # Next.js UI (Port 3000)
├── deploy/               # Deployment scripts
├── docker-compose.yml    # Docker orchestration
└── pom.xml              # Parent POM
```

## 🚢 Deployment

See [AWS-DEPLOYMENT.md](deploy/AWS-DEPLOYMENT.md) for production deployment instructions.

## 📚 Additional Resources

- **Spring Boot**: https://spring.io/projects/spring-boot
- **Spring Cloud**: https://spring.io/projects/spring-cloud
- **Next.js**: https://nextjs.org/docs
- **React Bootstrap**: https://react-bootstrap.github.io/
- **PostgreSQL**: https://www.postgresql.org/docs/

## 💡 Features Implemented

✅ User registration and authentication with JWT
✅ Product catalog with search and filters
✅ Shopping cart management
✅ Order processing and tracking
✅ Fake payment gateway integration
✅ Admin panel for product management
✅ Microservices architecture
✅ Service discovery with Eureka
✅ API Gateway for routing
✅ Responsive UI with Bootstrap
✅ Docker containerization
✅ AWS deployment ready

## 📧 Support

This is a college project. For questions or issues, please refer to the documentation or contact your instructor.

---

**Happy Coding! 🎉**

