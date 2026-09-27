# Stage 1: Build Mentorship Service with Maven
FROM maven:3.9.9-eclipse-temurin-21-alpine AS builder
WORKDIR /build

# Copy the entire multi-module backend source tree
COPY . .

# Build only the mentorship-service JAR and its dependencies
RUN mvn -B clean package -pl mentorship-service -am -DskipTests

# Stage 2: Minimal JRE 21 Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Copy the exact Spring Boot executable JAR
COPY --from=builder /build/mentorship-service/target/mentorship-service-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8102
ENTRYPOINT ["java", "-jar", "app.jar"]
