# H2 → PostgreSQL Migration Guide

## 🔑 Default Login Credentials

| Role  | Email               | Password   | Access                          |
|-------|---------------------|------------|---------------------------------|
| Admin | admin@suvida.com    | admin123   | Full admin panel + all features |
| User  | user@suvida.com     | user123    | Shopping, cart, orders          |

> **H2 Console URLs (local testing only)**
> | Service         | H2 Console URL                            | JDBC URL                            |
> |-----------------|-------------------------------------------|-------------------------------------|
> | user-service    | http://localhost:8081/h2-console          | `jdbc:h2:file:./data/suvida_users`    |
> | product-service | http://localhost:8082/h2-console          | `jdbc:h2:file:./data/suvida_products` |
> | cart-service    | http://localhost:8083/h2-console          | `jdbc:h2:file:./data/suvida_cart`     |
> | order-service   | http://localhost:8084/h2-console          | `jdbc:h2:file:./data/suvida_orders`   |
> | payment-service | http://localhost:8085/h2-console          | `jdbc:h2:file:./data/suvida_payments` |
>
> Username: `postgres` | Password: `postgres`

---

## Overview

The project is **already dual-configured**. Every service includes both the H2 and
PostgreSQL drivers. Switching between them is purely a configuration change — no
code changes are needed.

| Environment         | Database                | How it is selected                              |
|---------------------|-------------------------|-------------------------------------------------|
| Local (default)     | H2 file-based           | `application.properties` defaults               |
| Docker / Production | PostgreSQL              | `SPRING_DATASOURCE_URL` environment variable     |

---

## Step 1 — Install & Configure PostgreSQL

### Option A — Docker (quickest)

```bash
docker run -d \
  --name suvida-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:14-alpine
```

### Option B — Local Install

Download PostgreSQL 14+ from https://www.postgresql.org/download/ and install it.

---

## Step 2 — Create the Databases

Connect to PostgreSQL and run:

```sql
CREATE DATABASE suvida_users;
CREATE DATABASE suvida_products;
CREATE DATABASE suvida_cart;
CREATE DATABASE suvida_orders;
CREATE DATABASE suvida_payments;
```

Or run the included script:

```bash
psql -U postgres -f init-databases.sql
```

---

## Step 3 — Update `application.properties` for Each Service

Make the following change in each service's
`src/main/resources/application.properties`:

### Before (H2 — local testing)

```properties
spring.datasource.url=jdbc:h2:file:./data/suvida_users
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### After (PostgreSQL)

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/suvida_users
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
# Remove or set to false:
spring.h2.console.enabled=false
```

Repeat for each service, changing the database name:

| Service         | Database name     |
|-----------------|-------------------|
| user-service    | suvida_users      |
| product-service | suvida_products   |
| cart-service    | suvida_cart       |
| order-service   | suvida_orders     |
| payment-service | suvida_payments   |

---

## Step 4 — (Optional) Use Spring Profiles Instead of Editing Files

A cleaner approach is to use Spring profiles so you can switch without touching files.

### 4a — Create `application-postgres.properties` in each service

Example for `user-service`:

```properties
# user-service/src/main/resources/application-postgres.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/suvida_users
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.h2.console.enabled=false
```

### 4b — Activate the profile at startup

```bash
java -jar user-service-1.0.0.jar --spring.profiles.active=postgres
```

Or set the environment variable:

```bash
export SPRING_PROFILES_ACTIVE=postgres   # Linux/Mac
$env:SPRING_PROFILES_ACTIVE="postgres"   # PowerShell
```

---

## Step 5 — Docker Compose (Production / Shared Environments)

The `docker-compose.yml` already sets `SPRING_DATASOURCE_URL` as an environment
variable, which **overrides** the `application.properties` file. No file edits are
needed for Docker deployments.

```yaml
user-service:
  environment:
    SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/suvida_users
```

Just run:

```bash
docker-compose up --build
```

---

## Step 6 — Rebuild After Changing Properties

After editing `application.properties`:

```bash
# From project root
mvn clean package -DskipTests

# Or rebuild a single service
cd user-service && mvn clean package -DskipTests
```

Then restart the service.

---

## Step 7 — Verify Connection

Once running, check each service's actuator health endpoint:

```
http://localhost:8081/actuator/health   → user-service
http://localhost:8082/actuator/health   → product-service
http://localhost:8083/actuator/health   → cart-service
http://localhost:8084/actuator/health   → order-service
http://localhost:8085/actuator/health   → payment-service
```

Expected response:

```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP", "details": { "database": "PostgreSQL" } }
  }
}
```

---

## Quick Reference — Environment Variables for Production

Instead of editing any files, you can override everything with environment variables:

| Variable                                  | Example value                                        |
|-------------------------------------------|------------------------------------------------------|
| `SPRING_DATASOURCE_URL`                   | `jdbc:postgresql://db-host:5432/suvida_users`        |
| `SPRING_DATASOURCE_USERNAME`              | `postgres`                                           |
| `SPRING_DATASOURCE_PASSWORD`              | `yourSecurePassword`                                 |
| `SPRING_JPA_HIBERNATE_DDL_AUTO`           | `validate` (use `update` only in dev)                |
| `EUREKA_CLIENT_SERVICEURL_DEFAULTZONE`    | `http://service-registry:8761/eureka/`               |
| `JWT_SECRET`                              | `your-long-random-secret-key`                        |

---

## Summary Checklist

- [ ] PostgreSQL running and reachable
- [ ] All 5 databases created (`suvida_users`, `suvida_products`, `suvida_cart`, `suvida_orders`, `suvida_payments`)
- [ ] Each `application.properties` updated OR env vars set
- [ ] Services rebuilt (`mvn clean package -DskipTests`)
- [ ] Services restarted and health endpoints return `"database": "PostgreSQL"`
- [ ] Frontend `NEXT_PUBLIC_API_URL=http://localhost:8080` (unchanged)
- [ ] Admin login tested: `admin@suvida.com` / `admin123`

