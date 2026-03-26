# Stage 1: Build
FROM eclipse-temurin:21.0.2_13-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN chmod +x gradlew && ./gradlew clean build -x test

# Stage 2: Runtime
FROM eclipse-temurin:21.0.2_13-jre-alpine
LABEL maintainer="chinthaka@javatodev.com"
VOLUME /main-app
WORKDIR /app
COPY --from=builder /app/build/libs/core-banking-service-0.0.1-SNAPSHOT.jar app.jar
COPY --from=builder /app/wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh && apk add --no-cache bash
EXPOSE 8092
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "/app/app.jar"]
