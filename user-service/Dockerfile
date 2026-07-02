FROM eclipse-temurin:17-jdk-alpine AS build
ENTRYPOINT ["java", "-jar", "app.jar"]
EXPOSE 8081
COPY --from=build /app/target/*.jar app.jar
WORKDIR /app
FROM eclipse-temurin:17-jre-alpine

RUN mvn clean package -DskipTests
RUN apk add --no-cache maven
COPY ../pom.xml ../pom.xml
COPY src ./src
COPY pom.xml .
WORKDIR /app

