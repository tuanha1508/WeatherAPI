#!/bin/bash

echo "🎯 Generating API test calls for Keploy recording..."

BASE_URL="http://localhost:3000"

# Wait a moment for server to be ready
sleep 3

echo "1. 🏥 Health Check"
curl -X GET "$BASE_URL/health" \
  -H "Accept: application/json"

echo -e "\n\n2. 📍 Root API Info"
curl -X GET "$BASE_URL/" \
  -H "Accept: application/json"

echo -e "\n\n3. 📋 Get all weather data"
curl -X GET "$BASE_URL/api/weather" \
  -H "Accept: application/json"

echo -e "\n\n4. 🏙️ Get weather for New York"
curl -X GET "$BASE_URL/api/weather/New%20York" \
  -H "Accept: application/json"

echo -e "\n\n5. 🔍 Search for cities with 'New'"
curl -X GET "$BASE_URL/api/weather/search/New" \
  -H "Accept: application/json"

echo -e "\n\n6. ➕ Add new weather data for Miami"
curl -X POST "$BASE_URL/api/weather" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city": "Miami",
    "temperature": 28.5,
    "humidity": 78,
    "pressure": 1016.2,
    "description": "Sunny",
    "wind_speed": 12.3,
    "visibility": 15.0
  }'

echo -e "\n\n7. 📝 Update weather data for ID 1"
curl -X PUT "$BASE_URL/api/weather/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city": "New York",
    "temperature": 20.0,
    "humidity": 60,
    "pressure": 1012.0,
    "description": "Clear sky",
    "wind_speed": 10.0,
    "visibility": 12.0
  }'

echo -e "\n\n8. 🔍 Search for cities with 'Miami'"
curl -X GET "$BASE_URL/api/weather/search/Miami" \
  -H "Accept: application/json"

echo -e "\n\n9. 🗑️ Delete weather data for Miami (assuming ID 6)"
curl -X DELETE "$BASE_URL/api/weather/6" \
  -H "Accept: application/json"

echo -e "\n\n10. ❌ Test error case - get non-existent city"
curl -X GET "$BASE_URL/api/weather/NonExistentCity" \
  -H "Accept: application/json"

echo -e "\n\n11. ❌ Test error case - invalid POST data"
curl -X POST "$BASE_URL/api/weather" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city": "TestCity"
  }'

echo -e "\n\n12. ❌ Test error case - update non-existent ID"
curl -X PUT "$BASE_URL/api/weather/999" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "city": "Test",
    "temperature": 25.0,
    "humidity": 50,
    "pressure": 1013.0,
    "description": "Test",
    "wind_speed": 10.0,
    "visibility": 10.0
  }'

echo -e "\n\n✅ All test calls completed!" 