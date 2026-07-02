# AWS Deployment Guide for Suvida E-Commerce

This guide explains how to deploy the Suvida microservices application to AWS.

## Prerequisites

- AWS Account
- AWS CLI installed and configured
- Docker installed
- kubectl installed (for EKS deployment)

## Deployment Options

### Option 1: AWS ECS with Fargate (Recommended for College Project)

This is the simplest option and doesn't require managing servers.

#### Step 1: Create ECR Repositories

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_AWS_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Create repositories for each service
aws ecr create-repository --repository-name suvida/service-registry
aws ecr create-repository --repository-name suvida/api-gateway
aws ecr create-repository --repository-name suvida/user-service
aws ecr create-repository --repository-name suvida/product-service
aws ecr create-repository --repository-name suvida/cart-service
aws ecr create-repository --repository-name suvida/order-service
aws ecr create-repository --repository-name suvida/payment-service
aws ecr create-repository --repository-name suvida/frontend
```

#### Step 2: Build and Push Docker Images

Use the provided script:

```bash
cd deploy/aws
./build-and-push.sh YOUR_AWS_ACCOUNT_ID us-east-1
```

#### Step 3: Create RDS PostgreSQL Database

```bash
aws rds create-db-instance \
    --db-instance-identifier suvida-postgres \
    --db-instance-class db.t3.micro \
    --engine postgres \
    --master-username postgres \
    --master-user-password YOUR_PASSWORD \
    --allocated-storage 20 \
    --vpc-security-group-ids YOUR_SECURITY_GROUP_ID \
    --publicly-accessible
```

#### Step 4: Deploy with ECS

```bash
# Create ECS cluster
aws ecs create-cluster --cluster-name suvida-cluster

# Deploy services using the provided task definitions
cd deploy/aws
./deploy-ecs.sh
```

### Option 2: AWS EC2 with Docker Compose

#### Step 1: Launch EC2 Instance

```bash
# Launch a t3.medium instance with Amazon Linux 2
aws ec2 run-instances \
    --image-id ami-0c55b159cbfafe1f0 \
    --instance-type t3.medium \
    --key-name YOUR_KEY_PAIR \
    --security-group-ids YOUR_SECURITY_GROUP_ID \
    --subnet-id YOUR_SUBNET_ID
```

#### Step 2: Install Dependencies

```bash
# SSH into the instance
ssh -i your-key.pem ec2-user@YOUR_INSTANCE_IP

# Install Docker and Docker Compose
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 3: Deploy Application

```bash
# Clone repository
git clone YOUR_REPO_URL
cd suvida

# Start services
docker-compose up -d
```

### Option 3: AWS EKS (Kubernetes)

For more advanced deployment with auto-scaling and high availability.

#### Step 1: Create EKS Cluster

```bash
# Install eksctl
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin

# Create cluster
eksctl create cluster \
    --name suvida-cluster \
    --region us-east-1 \
    --nodegroup-name standard-workers \
    --node-type t3.medium \
    --nodes 3 \
    --nodes-min 1 \
    --nodes-max 4
```

#### Step 2: Deploy with Kubernetes

```bash
cd deploy/kubernetes
kubectl apply -f namespace.yaml
kubectl apply -f postgres.yaml
kubectl apply -f redis.yaml
kubectl apply -f services/
kubectl apply -f ingress.yaml
```

## Environment Variables

Update the following environment variables for production:

### Database
- `SPRING_DATASOURCE_URL`: Your RDS endpoint
- `SPRING_DATASOURCE_USERNAME`: Database username
- `SPRING_DATASOURCE_PASSWORD`: Database password

### Application
- `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`: Service registry URL
- `JWT_SECRET`: Change to a strong secret key
- `NEXT_PUBLIC_API_URL`: Your API Gateway URL

## Security Considerations

1. **Change Default Passwords**: Update all default passwords in production
2. **Use Secrets Manager**: Store sensitive data in AWS Secrets Manager
3. **Enable HTTPS**: Use AWS Certificate Manager and Application Load Balancer
4. **Security Groups**: Restrict access to only necessary ports
5. **IAM Roles**: Use IAM roles for EC2/ECS instances instead of access keys

## Monitoring

### CloudWatch
- Enable CloudWatch logs for all services
- Set up alarms for CPU, memory, and error rates

### Application Monitoring
```bash
# View logs
docker-compose logs -f SERVICE_NAME

# For ECS
aws logs tail /ecs/suvida/SERVICE_NAME --follow
```

## Cost Estimation (Monthly)

### Minimal Setup (Free Tier Eligible)
- EC2 t3.micro: $0 (Free tier)
- RDS db.t3.micro: ~$15
- **Total: ~$15/month**

### Production Setup
- ECS Fargate: ~$50
- RDS db.t3.small: ~$30
- Application Load Balancer: ~$20
- **Total: ~$100/month**

## Scaling

### Auto Scaling (ECS)
```bash
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --scalable-dimension ecs:service:DesiredCount \
    --resource-id service/suvida-cluster/user-service \
    --min-capacity 1 \
    --max-capacity 10
```

## Backup

### Database Backup
```bash
# Enable automated backups on RDS
aws rds modify-db-instance \
    --db-instance-identifier suvida-postgres \
    --backup-retention-period 7 \
    --preferred-backup-window "03:00-04:00"
```

## Troubleshooting

### Service Not Starting
1. Check logs: `docker logs CONTAINER_NAME`
2. Verify environment variables
3. Check database connectivity

### Database Connection Issues
1. Verify security group allows inbound on port 5432
2. Check RDS endpoint and credentials
3. Ensure services are in same VPC

### High Memory Usage
1. Increase instance size
2. Optimize JVM heap settings: `-Xmx512m -Xms256m`
3. Enable auto-scaling

## Support

For issues or questions, refer to:
- AWS Documentation: https://docs.aws.amazon.com/
- Spring Cloud: https://spring.io/projects/spring-cloud
- Next.js Deployment: https://nextjs.org/docs/deployment

