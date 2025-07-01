#!/bin/bash

echo "🚀 Starting Keploy Recording for Weather API..."

# Clean up any existing containers
docker-compose -f docker-compose.keploy.yml down

# Start the application with Keploy recording
echo "📦 Building and starting containers..."
docker-compose -f docker-compose.keploy.yml up --build -d

# Wait for the application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 10

# Check if app is running
if curl -f http://localhost:3000/health >/dev/null 2>&1; then
    echo "✅ Application is ready!"
else
    echo "❌ Application is not responding. Check logs:"
    docker-compose -f docker-compose.keploy.yml logs weather-api
    exit 1
fi

echo "🎯 Recording API interactions..."
echo "Please make API calls to record test cases:"
echo "  - GET http://localhost:3000/api/weather"
echo "  - GET http://localhost:3000/api/weather/New%20York"
echo "  - POST http://localhost:3000/api/weather"
echo "  - PUT http://localhost:3000/api/weather/1"
echo "  - DELETE http://localhost:3000/api/weather/1"
echo "  - GET http://localhost:3000/api/weather/search/New"

echo ""
echo "Press CTRL+C when you're done recording..."

# Keep the script running until user stops it
trap 'echo "🛑 Stopping recording..."; docker-compose -f docker-compose.keploy.yml down; exit 0' INT

# Monitor logs
docker-compose -f docker-compose.keploy.yml logs -f 