#!/bin/bash

# Weather API Testing Script
# Make sure the server is running on http://localhost:3000 before running this script

echo "🌤️  Weather API Testing Script"
echo "================================="
echo ""

BASE_URL="http://localhost:3000"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_test() {
    echo -e "${BLUE}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if server is running
echo "Checking if server is running..."
if curl -s "$BASE_URL/health" > /dev/null; then
    print_success "Server is running!"
else
    print_warning "Server is not running. Please start it with 'npm start'"
    exit 1
fi

echo ""

# Test 1: Health Check
print_test "1️⃣  Testing Health Endpoint"
echo "Command: curl -X GET $BASE_URL/health"
curl -X GET "$BASE_URL/health" | jq
echo ""
echo ""

# Test 2: Get All Weather Data
print_test "2️⃣  Getting All Weather Data"
echo "Command: curl -X GET $BASE_URL/api/weather"
curl -X GET "$BASE_URL/api/weather" | jq
echo ""
echo ""

# Test 3: Get Weather by City
print_test "3️⃣  Getting Weather for London"
echo "Command: curl -X GET $BASE_URL/api/weather/London"
curl -X GET "$BASE_URL/api/weather/London" | jq
echo ""
echo ""

# Test 4: Search Weather
print_test "4️⃣  Searching for Cities containing 'tok'"
echo "Command: curl -X GET $BASE_URL/api/weather/search/tok"
curl -X GET "$BASE_URL/api/weather/search/tok" | jq
echo ""
echo ""

# Test 5: Add New Weather Data
print_test "5️⃣  Adding New Weather Data for Barcelona"
echo "Command: curl -X POST $BASE_URL/api/weather -H \"Content-Type: application/json\" -d '{\"city\": \"Barcelona\", \"temperature\": 24.5, \"humidity\": 65, \"pressure\": 1015.2, \"description\": \"Sunny\", \"wind_speed\": 12.3, \"visibility\": 15.0}'"
curl -X POST "$BASE_URL/api/weather" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Barcelona",
    "temperature": 24.5,
    "humidity": 65,
    "pressure": 1015.2,
    "description": "Sunny",
    "wind_speed": 12.3,
    "visibility": 15.0
  }' | jq
echo ""
echo ""

# Test 6: Try to Add Duplicate (Should fail)
print_test "6️⃣  Trying to Add Duplicate Data (Should Fail)"
echo "Command: curl -X POST $BASE_URL/api/weather -H \"Content-Type: application/json\" -d '{\"city\": \"Barcelona\", \"temperature\": 25.0, \"humidity\": 70, \"pressure\": 1012.0, \"description\": \"Cloudy\", \"wind_speed\": 10.0, \"visibility\": 12.0}'"
curl -X POST "$BASE_URL/api/weather" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Barcelona",
    "temperature": 25.0,
    "humidity": 70,
    "pressure": 1012.0,
    "description": "Cloudy",
    "wind_speed": 10.0,
    "visibility": 12.0
  }' | jq
echo ""
echo ""

# Test 7: Get the newly added Barcelona data to get its ID
print_test "7️⃣  Getting Barcelona Data to Find ID"
echo "Command: curl -X GET $BASE_URL/api/weather/Barcelona"
BARCELONA_DATA=$(curl -s -X GET "$BASE_URL/api/weather/Barcelona")
echo "$BARCELONA_DATA" | jq
BARCELONA_ID=$(echo "$BARCELONA_DATA" | jq -r '.data.id')
echo ""
echo ""

# Test 8: Update Weather Data
if [ "$BARCELONA_ID" != "null" ] && [ "$BARCELONA_ID" != "" ]; then
    print_test "8️⃣  Updating Barcelona Weather Data (ID: $BARCELONA_ID)"
    echo "Command: curl -X PUT $BASE_URL/api/weather/$BARCELONA_ID -H \"Content-Type: application/json\" -d '{\"city\": \"Barcelona\", \"temperature\": 27.0, \"humidity\": 62, \"pressure\": 1018.0, \"description\": \"Partly cloudy\", \"wind_speed\": 15.0, \"visibility\": 18.0}'"
    curl -X PUT "$BASE_URL/api/weather/$BARCELONA_ID" \
      -H "Content-Type: application/json" \
      -d '{
        "city": "Barcelona",
        "temperature": 27.0,
        "humidity": 62,
        "pressure": 1018.0,
        "description": "Partly cloudy",
        "wind_speed": 15.0,
        "visibility": 18.0
      }' | jq
    echo ""
    echo ""

    # Test 9: Delete Weather Data
    print_test "9️⃣  Deleting Barcelona Weather Data (ID: $BARCELONA_ID)"
    echo "Command: curl -X DELETE $BASE_URL/api/weather/$BARCELONA_ID"
    curl -X DELETE "$BASE_URL/api/weather/$BARCELONA_ID" | jq
    echo ""
    echo ""
else
    print_warning "Could not find Barcelona ID, skipping update and delete tests"
fi

# Test 10: Test Invalid Endpoint
print_test "🔟 Testing Invalid Endpoint (Should Return 404)"
echo "Command: curl -X GET $BASE_URL/api/invalid"
curl -X GET "$BASE_URL/api/invalid" | jq
echo ""
echo ""

# Test 11: Test Invalid Data (Should Return 400)
print_test "1️⃣1️⃣ Testing Invalid Data (Should Return 400)"
echo "Command: curl -X POST $BASE_URL/api/weather -H \"Content-Type: application/json\" -d '{\"city\": \"IncompleteCity\"}'"
curl -X POST "$BASE_URL/api/weather" \
  -H "Content-Type: application/json" \
  -d '{
    "city": "IncompleteCity"
  }' | jq
echo ""
echo ""

print_success "🎉 API Testing Complete!"
echo ""
echo "📚 For more information:"
echo "   • Frontend: http://localhost:3000"
echo "   • API Docs: Built into the frontend"
echo "   • Health Check: http://localhost:3000/health"
echo ""
echo "🧪 To run automated tests: npm test" 