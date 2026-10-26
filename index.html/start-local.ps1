# Suvida - Start all services locally with H2 database
$root = "C:\Users\6896232\HobbyProjects\suvida"

Write-Host "=== Suvida Local Startup ===" -ForegroundColor Cyan

# Kill any existing Java processes
Write-Host "Stopping any existing Java processes..." -ForegroundColor Yellow
Stop-Process -Name java -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3

# Ensure directories exist
New-Item -Force -ItemType Directory "$root\logs" | Out-Null
New-Item -Force -ItemType Directory "$root\data" | Out-Null

# Helper: wait for a port to open
function Wait-Port($port, $name, $timeoutSec=60) {
    Write-Host "  Waiting for $name (port $port)..." -ForegroundColor Yellow
    for ($i=0; $i -lt $timeoutSec; $i+=2) {
        Start-Sleep 2
        $conn = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet -ErrorAction SilentlyContinue 2>$null
        if ($conn) { Write-Host "  $name is UP on :$port" -ForegroundColor Green; return $true }
        if ($i % 10 -eq 0 -and $i -gt 0) { Write-Host "  ...still waiting ${i}s" }
    }
    Write-Host "  WARNING: $name did not start within ${timeoutSec}s" -ForegroundColor Red
    return $false
}

# 1 - Service Registry (Eureka) - must start first
Write-Host "`n[1/7] Starting service-registry (Eureka)..." -ForegroundColor Cyan
Start-Process java -ArgumentList @("-jar", "$root\service-registry\target\service-registry-1.0.0.jar") `
    -WorkingDirectory $root `
    -RedirectStandardOutput "$root\logs\service-registry.log" `
    -RedirectStandardError  "$root\logs\service-registry-err.log" `
    -WindowStyle Hidden
Wait-Port 8761 "service-registry"

# 2 - API Gateway
Write-Host "`n[2/7] Starting api-gateway..." -ForegroundColor Cyan
Start-Process java -ArgumentList @("-jar", "$root\api-gateway\target\api-gateway-1.0.0.jar") `
    -WorkingDirectory $root `
    -RedirectStandardOutput "$root\logs\api-gateway.log" `
    -RedirectStandardError  "$root\logs\api-gateway-err.log" `
    -WindowStyle Hidden

# 3 - User Service
Write-Host "`n[3/7] Starting user-service..." -ForegroundColor Cyan
Start-Process java -ArgumentList @("-jar", "$root\user-service\target\user-service-1.0.0.jar") `
    -WorkingDirectory $root `
    -RedirectStandardOutput "$root\logs\user-service.log" `
    -RedirectStandardError  "$root\logs\user-service-err.log" `
    -WindowStyle Hidden

# 4 - Product Service
Write-Host "`n[4/7] Starting product-service..." -ForegroundColor Cyan
Start-Process java -ArgumentList @("-jar", "$root\product-service\target\product-service-1.0.0.jar") `
    -WorkingDirectory $root `
    -RedirectStandardOutput "$root\logs\product-service.log" `
    -RedirectStandardError  "$root\logs\product-service-err.log" `
    -WindowStyle Hidden

# 5 - Cart Service
Write-Host "`n[5/7] Starting cart-service..." -ForegroundColor Cyan
Start-Process java -ArgumentList @("-jar", "$root\cart-service\target\cart-service-1.0.0.jar") `
    -WorkingDirectory $root `
    -RedirectStandardOutput "$root\logs\cart-service.log" `
    -RedirectStandardError  "$root\logs\cart-service-err.log" `
    -WindowStyle Hidden

# 6 - Order Service
Write-Host "`n[6/7] Starting order-service..." -ForegroundColor Cyan
Start-Process java -ArgumentList @("-jar", "$root\order-service\target\order-service-1.0.0.jar") `
    -WorkingDirectory $root `
    -RedirectStandardOutput "$root\logs\order-service.log" `
    -RedirectStandardError  "$root\logs\order-service-err.log" `
    -WindowStyle Hidden

# 7 - Payment Service
Write-Host "`n[7/7] Starting payment-service..." -ForegroundColor Cyan
Start-Process java -ArgumentList @("-jar", "$root\payment-service\target\payment-service-1.0.0.jar") `
    -WorkingDirectory $root `
    -RedirectStandardOutput "$root\logs\payment-service.log" `
    -RedirectStandardError  "$root\logs\payment-service-err.log" `
    -WindowStyle Hidden

# Wait for all microservices (parallel startup is fine now that Eureka is up)
Write-Host "`nWaiting for all microservices to register..." -ForegroundColor Yellow
Wait-Port 8081 "user-service"    40
Wait-Port 8082 "product-service" 40
Wait-Port 8083 "cart-service"    40
Wait-Port 8084 "order-service"   40
Wait-Port 8085 "payment-service" 40
Wait-Port 8080 "api-gateway"     40

Write-Host "`n=== All backend services started! ===" -ForegroundColor Green
Write-Host "  Eureka dashboard : http://localhost:8761" -ForegroundColor White
Write-Host "  API Gateway      : http://localhost:8080" -ForegroundColor White
Write-Host "  H2 console (users)   : http://localhost:8081/h2-console  -> jdbc:h2:file:./data/suvida_users" -ForegroundColor White
Write-Host "  H2 console (products): http://localhost:8082/h2-console  -> jdbc:h2:file:./data/suvida_products" -ForegroundColor White

# ---- Frontend ----
Write-Host "`n=== Starting Next.js frontend ===" -ForegroundColor Cyan
Set-Location "$root\frontend"
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies (first time)..." -ForegroundColor Yellow
    npm install
}
Write-Host "Starting Next.js dev server on http://localhost:3000 ..." -ForegroundColor Green
npm run dev

