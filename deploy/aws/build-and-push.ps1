# Build and push Docker images to AWS ECR (PowerShell version)
# Usage: .\build-and-push.ps1 -AwsAccountId <id> -AwsRegion <region>

param(
    [Parameter(Mandatory=$true)]
    [string]$AwsAccountId,

    [Parameter(Mandatory=$true)]
    [string]$AwsRegion
)

$ECR_URL = "$AwsAccountId.dkr.ecr.$AwsRegion.amazonaws.com"

Write-Host "🔐 Logging in to AWS ECR..." -ForegroundColor Cyan
aws ecr get-login-password --region $AwsRegion | docker login --username AWS --password-stdin $ECR_URL

Write-Host "📦 Building and pushing images..." -ForegroundColor Cyan

# Array of services
$services = @(
    "service-registry",
    "api-gateway",
    "user-service",
    "product-service",
    "cart-service",
    "order-service",
    "payment-service"
)

# Build and push backend services
foreach ($service in $services) {
    Write-Host "Building $service..." -ForegroundColor Yellow
    Set-Location "..\..\$service"
    docker build -t "suvida/$service" .
    docker tag "suvida/${service}:latest" "$ECR_URL/suvida/${service}:latest"
    docker push "$ECR_URL/suvida/${service}:latest"
    Write-Host "✅ $service pushed successfully" -ForegroundColor Green
}

# Build and push frontend
Write-Host "Building frontend..." -ForegroundColor Yellow
Set-Location "..\..\frontend"
docker build -t "suvida/frontend" .
docker tag "suvida/frontend:latest" "$ECR_URL/suvida/frontend:latest"
docker push "$ECR_URL/suvida/frontend:latest"
Write-Host "✅ frontend pushed successfully" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 All images built and pushed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Create RDS PostgreSQL database"
Write-Host "2. Update environment variables in ECS task definitions"
Write-Host "3. Deploy services using AWS Console or ECS CLI"

