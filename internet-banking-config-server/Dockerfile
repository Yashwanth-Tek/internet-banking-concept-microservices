# Stage 1: Build with JDK
FROM eclipse-temurin:21.0.2_13-jdk-alpine AS builder
WORKDIR /app
COPY . .
RUN cd internet-banking-config-server && chmod +x gradlew && ./gradlew clean build -x test
 
# Stage 2: Runtime with JRE
FROM eclipse-temurin:21.0.2_13-jre-alpine
LABEL maintainer="chinthaka@javatodev.com"
VOLUME /main-app
WORKDIR /app
 
COPY --from=builder /app/internet-banking-config-server/build/libs/internet-banking-config-server-0.0.1-SNAPSHOT.jar app.jar
COPY --from=builder /app/internet-banking-config-server/wait-for-it.sh wait-for-it.sh
RUN chmod +x wait-for-it.sh
RUN apk add --no-cache bash
 
EXPOSE 8092
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=docker", "/app/app.jar"]
