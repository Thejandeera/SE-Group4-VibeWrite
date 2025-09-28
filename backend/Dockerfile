# Use official OpenJDK 17 image
FROM eclipse-temurin:17-jdk-jammy

# Set working directory
WORKDIR /app

# Copy pom.xml and Maven wrapper files
COPY pom.xml .
COPY mvnw .
COPY mvnw.cmd .
COPY .mvn .mvn

# Make Maven wrapper executable
RUN chmod +x ./mvnw

# Copy source code
COPY src ./src

# Build the project using Maven wrapper with increased memory
RUN MAVEN_OPTS="-Xmx2g" ./mvnw clean package -DskipTests

# Find and copy the jar file (handles different naming)
RUN find target -name "*.jar" -not -name "*-sources.jar" -not -name "*-javadoc.jar" -exec cp {} app.jar \;

# Expose port 8080
EXPOSE 8080

# Set JVM memory options for runtime
ENV JAVA_OPTS="-Xms512m -Xmx1536m -XX:+UseG1GC -XX:MaxGCPauseMillis=200"

# Run the application with memory settings
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]