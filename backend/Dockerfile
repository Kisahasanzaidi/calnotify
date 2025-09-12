# Stage 1: Build the JAR
FROM maven:3.8.5-openjdk-17 AS build

# Set working directory
WORKDIR /app

# Copy Maven config and source code
COPY pom.xml .
COPY src ./src

# Build the JAR (skip tests to speed up)
RUN mvn clean package -DskipTests


# Stage 2: Run the JAR
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/calnotify-0.0.1-SNAPSHOT.jar app.jar

# Expose backend port
EXPOSE 8080

# Start the application
ENTRYPOINT ["java", "-jar", "app.jar"]
