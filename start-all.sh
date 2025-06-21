#!/bin/bash

# Weather API Full Stack Startup Script
# This script starts both the API server and the Next.js frontend

echo "🌤️  Starting Weather API Full Stack Application"
echo "=============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js to continue."
    exit 1
fi

print_success "Node.js is installed: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm to continue."
    exit 1
fi

print_success "npm is installed: $(npm --version)"
echo ""

# Install API server dependencies if needed
print_info "Checking API server dependencies..."
if [ ! -d "node_modules" ]; then
    print_warning "Installing API server dependencies..."
    npm install
    if [ $? -eq 0 ]; then
        print_success "API server dependencies installed"
    else
        print_error "Failed to install API server dependencies"
        exit 1
    fi
else
    print_success "API server dependencies already installed"
fi

# Install frontend dependencies if needed
print_info "Checking frontend dependencies..."
if [ ! -d "weather-frontend/node_modules" ]; then
    print_warning "Installing frontend dependencies..."
    cd weather-frontend
    npm install
    if [ $? -eq 0 ]; then
        print_success "Frontend dependencies installed"
        cd ..
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
else
    print_success "Frontend dependencies already installed"
fi

echo ""
print_info "Starting both API server and frontend..."
echo ""

# Function to cleanup background processes on exit
cleanup() {
    print_warning "Shutting down servers..."
    if [ ! -z "$API_PID" ]; then
        kill $API_PID 2>/dev/null
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
    fi
    exit 0
}

# Set up signal handling
trap cleanup SIGINT SIGTERM

# Start API server in background
print_info "Starting API server on http://localhost:3000..."
npm start &
API_PID=$!

# Wait a moment for the API server to start
sleep 3

# Check if API server is running
if ps -p $API_PID > /dev/null; then
    print_success "API server started successfully (PID: $API_PID)"
else
    print_error "Failed to start API server"
    exit 1
fi

# Start frontend in background
print_info "Starting Next.js frontend on http://localhost:3001..."
cd weather-frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment for the frontend to start
sleep 5

# Check if frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    print_success "Frontend started successfully (PID: $FRONTEND_PID)"
else
    print_error "Failed to start frontend"
    kill $API_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Weather API Full Stack is now running!"
echo ""
echo "📡 API Server:      http://localhost:3000"
echo "🌐 Next.js Frontend: http://localhost:3001"
echo "📚 API Documentation: Available in both frontends"
echo ""
echo "💡 Available endpoints:"
echo "   • GET    /api/weather           - Get all weather data"
echo "   • GET    /api/weather/:city     - Get weather by city"
echo "   • POST   /api/weather           - Add new weather data"
echo "   • PUT    /api/weather/:id       - Update weather data"
echo "   • DELETE /api/weather/:id       - Delete weather data"
echo "   • GET    /api/weather/search/:query - Search weather data"
echo "   • GET    /health                - Health check"
echo ""
echo "🧪 To run tests:"
echo "   npm test"
echo "   ./test-api.sh"
echo ""
print_warning "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop the servers
while true; do
    sleep 1
    # Check if both processes are still running
    if ! ps -p $API_PID > /dev/null; then
        print_error "API server stopped unexpectedly"
        cleanup
    fi
    if ! ps -p $FRONTEND_PID > /dev/null; then
        print_error "Frontend stopped unexpectedly"
        cleanup
    fi
done 