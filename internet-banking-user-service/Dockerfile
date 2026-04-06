# Stage 1: Build with JDK
FROM eclipse-temurin:21.0.2_13-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN cd internet-banking-user-server && chmod +x gradlew && ./gradlew clean build -x test
 
# Stage 2: Runtime with JRE
FROM eclipse-temurin:21.0.2_13-jre-alpine
LABEL maintainer="chinthaka@javatodev.com"
VOLUME /main-app
WORKDIR /app
 
COPY --from=builder /app/internet-banking-user-server/build/libs/internet-banking-user-server-0.0.1-SNAPSHOT.jar app.jar
COPY --from=builder /app/internet-banking-user-server/wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh
RUN apk add --no-cache bash
 
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "/app/app.jar"]
