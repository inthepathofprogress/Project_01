#!/bin/bash

# Build and push Docker images to AWS ECR
# Usage: ./build-and-push.sh <aws-account-id> <region>

AWS_ACCOUNT_ID=$1
AWS_REGION=$2

if [ -z "$AWS_ACCOUNT_ID" ] || [ -z "$AWS_REGION" ]; then
    echo "Usage: ./build-and-push.sh <aws-account-id> <region>"
    echo "Example: ./build-and-push.sh 123456789012 us-east-1"
    exit 1
fi

ECR_URL="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

echo "🔐 Logging in to AWS ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_URL

echo "📦 Building and pushing images..."

# Array of services
services=(
    "service-registry"
    "api-gateway"
    "user-service"
    "product-service"
    "cart-service"
    "order-service"
    "payment-service"
)

# Build and push backend services
for service in "${services[@]}"; do
    echo "Building $service..."
    cd ../../$service
    docker build -t suvida/$service .
    docker tag suvida/$service:latest $ECR_URL/suvida/$service:latest
    docker push $ECR_URL/suvida/$service:latest
    echo "✅ $service pushed successfully"
done

# Build and push frontend
echo "Building frontend..."
cd ../../frontend
docker build -t suvida/frontend .
docker tag suvida/frontend:latest $ECR_URL/suvida/frontend:latest
docker push $ECR_URL/suvida/frontend:latest
echo "✅ frontend pushed successfully"

echo "🎉 All images built and pushed successfully!"
echo ""
echo "Next steps:"
echo "1. Create RDS PostgreSQL database"
echo "2. Update environment variables in ECS task definitions"
echo "3. Deploy services using ./deploy-ecs.sh"

