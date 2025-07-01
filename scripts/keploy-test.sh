#!/bin/bash

echo "🧪 Running Keploy Tests for Weather API..."

# Check if test recordings exist
if [ ! -d "./tests/keploy" ]; then
    echo "❌ No Keploy test recordings found. Please run recording first:"
    echo "   bash scripts/keploy-record.sh"
    exit 1
fi

# Clean up any existing containers
docker-compose -f docker-compose.keploy.yml down

# Start the application for testing
echo "📦 Starting application for testing..."
docker-compose -f docker-compose.keploy.yml up --build -d weather-api

# Wait for the application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 10

# Check if app is running
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Application is ready for testing!"
else
    echo "❌ Application is not responding. Check logs:"
    docker-compose -f docker-compose.keploy.yml logs weather-api
    exit 1
fi

# Run Keploy tests
echo "🎯 Running Keploy tests..."

# Use Keploy CLI to run tests
docker run --rm -v $(pwd):/app -v /var/run/docker.sock:/var/run/docker.sock \
  --network container:$(docker-compose -f docker-compose.keploy.yml ps -q weather-api) \
  ghcr.io/keploy/keploy:latest \
  test -c "curl -X GET http://localhost:3000/health" --delay 2

# Clean up
echo "🧹 Cleaning up..."
docker-compose -f docker-compose.keploy.yml down

echo "✅ Keploy testing completed!" 