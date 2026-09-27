# Stage 1: Build Auth Service with Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Copy the entire multi-module backend source tree
COPY . .

# Build only the auth-service JAR and its dependencies
RUN mvn -B clean package -pl auth-service -am -DskipTests

# Stage 2: Minimal JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup \
    && mkdir -p /app/uploads/resumes /app/uploads/certificates \
    && chown -R appuser:appgroup /app

# Copy the exact Spring Boot executable JAR
COPY --chown=appuser:appgroup --from=builder /build/auth-service/target/auth-service-0.0.1-SNAPSHOT.jar app.jar

USER appuser

EXPOSE 8101
ENTRYPOINT ["java", "-jar", "app.jar"]
