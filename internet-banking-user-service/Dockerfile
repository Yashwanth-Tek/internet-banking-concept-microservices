# Stage 1: Build with JDK
FROM eclipse-temurin:21.0.2_13-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN cd internet-banking-user-service && chmod +x gradlew && ./gradlew clean build -x test

# Stage 2: Runtime with JRE
FROM eclipse-temurin:21.0.2_13-jre-alpine
LABEL maintainer="chinthaka@javatodev.com"
WORKDIR /app

COPY --from=builder /app/internet-banking-user-service/build/libs/*.jar /app/app.jar
COPY --from=builder /app/internet-banking-user-service/wait-for-it.sh /app/wait-for-it.sh

RUN chmod +x /app/wait-for-it.sh
RUN apk add --no-cache bash

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "/app/app.jar"]
