#!/bin/bash

echo "🚀 Setting up Keploy API Testing for Weather API..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is installed and running"

# Check if curl is installed
if ! command -v curl &> /dev/null; then
    echo "❌ curl is not installed. Please install curl first."
    exit 1
fi

echo "✅ curl is available"

# Install Keploy CLI if not already installed
if ! command -v keploy &> /dev/null; then
    echo "📥 Installing Keploy CLI..."
    
    # Detect OS
    OS="$(uname -s)"
    case "${OS}" in
        Linux*)     
            curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz" | tar xz -C /tmp
            sudo mv /tmp/keploy /usr/local/bin
            ;;
        Darwin*)    
            curl --silent --location "https://github.com/keploy/keploy/releases/latest/download/keploy_darwin_amd64.tar.gz" | tar xz -C /tmp
            sudo mv /tmp/keploy /usr/local/bin
            ;;
        *)          
            echo "❌ Unsupported OS: ${OS}"
            exit 1
            ;;
    esac
    
    if command -v keploy &> /dev/null; then
        echo "✅ Keploy CLI installed successfully"
        keploy --version
    else
        echo "❌ Failed to install Keploy CLI"
        exit 1
    fi
else
    echo "✅ Keploy CLI is already installed"
    keploy --version
fi

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p tests/keploy/test-sets
mkdir -p scripts

# Make scripts executable
echo "🔧 Making scripts executable..."
chmod +x scripts/*.sh

# Install Node.js dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing Node.js dependencies..."
    npm install
fi

echo "✅ Setup completed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the API server: npm start"
echo "2. Record API tests: bash scripts/keploy-record.sh"
echo "3. Run recorded tests: bash scripts/keploy-test.sh"
echo "4. Check GitHub Actions for CI/CD integration"
echo ""
echo "📚 Documentation:"
echo "- OpenAPI Schema: openapi.yaml"
echo "- Keploy Config: keploy.yml"
echo "- Docker Compose: docker-compose.keploy.yml" 