# Suvida E-Commerce Setup Script for Windows
# This script helps set up the development environment

Write-Host "🚀 Suvida E-Commerce Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check prerequisites
Write-Host "Checking prerequisites..." -ForegroundColor Yellow

# Check Java
try {
    $javaVersion = java -version 2>&1 | Select-String "version" | ForEach-Object { $_.Line }
    Write-Host "✅ Java installed: $javaVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Java not found. Please install Java 17 or higher." -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18 or higher." -ForegroundColor Red
    exit 1
}

# Check Maven
try {
    $mavenVersion = mvn --version | Select-Object -First 1
    Write-Host "✅ Maven installed: $mavenVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Maven not found. Please install Maven 3.8 or higher." -ForegroundColor Red
    exit 1
}

# Check PostgreSQL
try {
    $pgVersion = psql --version
    Write-Host "✅ PostgreSQL installed: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  PostgreSQL not found. You can use Docker instead." -ForegroundColor Yellow
}

# Check Docker
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker installed: $dockerVersion" -ForegroundColor Green
    $hasDocker = $true
} catch {
    Write-Host "⚠️  Docker not found. Manual setup will be required." -ForegroundColor Yellow
    $hasDocker = $false
}

Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "Choose setup method:" -ForegroundColor Cyan
Write-Host "1. Docker Compose (Recommended)" -ForegroundColor White
Write-Host "2. Manual Setup" -ForegroundColor White
Write-Host "3. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-3)"

switch ($choice) {
    "1" {
        if (-not $hasDocker) {
            Write-Host "❌ Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
            exit 1
        }

        Write-Host ""
        Write-Host "🐳 Starting services with Docker Compose..." -ForegroundColor Cyan
        docker-compose up -d

        Write-Host ""
        Write-Host "⏳ Waiting for services to start (this may take a few minutes)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 30

        Write-Host ""
        Write-Host "✅ Services started successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Access the application:" -ForegroundColor Cyan
        Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
        Write-Host "  API Gateway: http://localhost:8080" -ForegroundColor White
        Write-Host "  Service Registry: http://localhost:8761" -ForegroundColor White
        Write-Host ""
        Write-Host "To stop services: docker-compose down" -ForegroundColor Yellow
    }

    "2" {
        Write-Host ""
        Write-Host "📝 Manual Setup Instructions" -ForegroundColor Cyan
        Write-Host ""

        # Setup databases
        Write-Host "Step 1: Creating databases..." -ForegroundColor Yellow
        $createDb = Read-Host "Do you want to create PostgreSQL databases now? (y/n)"

        if ($createDb -eq "y") {
            Write-Host "Please ensure PostgreSQL is running..."
            psql -U postgres -f init-databases.sql
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Databases created successfully!" -ForegroundColor Green
            } else {
                Write-Host "❌ Failed to create databases. Please create them manually." -ForegroundColor Red
            }
        }

        Write-Host ""
        Write-Host "Step 2: Install frontend dependencies..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        Set-Location ..
        Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green

        Write-Host ""
        Write-Host "Step 3: Build backend services..." -ForegroundColor Yellow
        $buildBackend = Read-Host "Do you want to build all backend services now? (y/n)"

        if ($buildBackend -eq "y") {
            mvn clean install -DskipTests
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Backend services built successfully!" -ForegroundColor Green
            } else {
                Write-Host "❌ Build failed. Please check the errors above." -ForegroundColor Red
            }
        }

        Write-Host ""
        Write-Host "✅ Setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "To start the application:" -ForegroundColor Cyan
        Write-Host "1. Open separate terminals for each service" -ForegroundColor White
        Write-Host "2. Start services in this order:" -ForegroundColor White
        Write-Host "   - service-registry: cd service-registry; mvn spring-boot:run" -ForegroundColor White
        Write-Host "   - api-gateway: cd api-gateway; mvn spring-boot:run" -ForegroundColor White
        Write-Host "   - user-service: cd user-service; mvn spring-boot:run" -ForegroundColor White
        Write-Host "   - product-service: cd product-service; mvn spring-boot:run" -ForegroundColor White
        Write-Host "   - cart-service: cd cart-service; mvn spring-boot:run" -ForegroundColor White
        Write-Host "   - order-service: cd order-service; mvn spring-boot:run" -ForegroundColor White
        Write-Host "   - payment-service: cd payment-service; mvn spring-boot:run" -ForegroundColor White
        Write-Host "   - frontend: cd frontend; npm run dev" -ForegroundColor White
        Write-Host ""
        Write-Host "See QUICK-START.md for detailed instructions." -ForegroundColor Yellow
    }

    "3" {
        Write-Host "Exiting..." -ForegroundColor Yellow
        exit 0
    }

    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - Quick Start: QUICK-START.md" -ForegroundColor White
Write-Host "  - AWS Deployment: deploy/AWS-DEPLOYMENT.md" -ForegroundColor White
Write-Host "  - README: README.md" -ForegroundColor White
Write-Host ""
Write-Host "Happy coding! 🎉" -ForegroundColor Green

