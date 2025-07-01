# 🎯 Keploy API Testing with AI Integration

This project integrates **Keploy AI-powered API testing** into the Weather API for automated test generation, recording, and execution in CI/CD pipelines.

## 📋 Overview

Keploy uses AI to automatically generate comprehensive API tests by recording actual API interactions and creating intelligent test cases. This integration provides:

- **✨ AI-Generated Tests**: Automatically creates test cases from API interactions
- **🔄 Record & Replay**: Records real API calls and replays them as tests
- **🤖 Smart Assertions**: AI-powered response validation
- **🚀 CI/CD Integration**: Automated testing in GitHub Actions
- **📊 Comprehensive Coverage**: Tests all API endpoints and edge cases

## 🏗️ Project Structure

```
WeatherAPI/
├── openapi.yaml                    # OpenAPI 3.0 specification
├── keploy.yml                     # Keploy configuration
├── docker-compose.keploy.yml      # Docker setup for Keploy
├── Dockerfile                     # Container configuration
├── scripts/
│   ├── setup-keploy.sh           # Setup and installation
│   ├── keploy-record.sh          # Record API tests
│   ├── keploy-test.sh            # Run recorded tests
│   └── generate-test-calls.sh    # Generate sample API calls
├── .github/workflows/
│   └── keploy-api-testing.yml    # CI/CD pipeline
└── tests/keploy/                 # Generated test recordings
```

## 🚀 Quick Start

### 1. Setup Keploy

```bash
# Run the setup script
bash scripts/setup-keploy.sh
```

This script will:
- Install Keploy CLI
- Verify Docker installation
- Create necessary directories
- Make scripts executable

### 2. Start the API Server

```bash
# Start your Weather API
npm start
```

### 3. Record API Tests

```bash
# Record API interactions with Keploy
bash scripts/keploy-record.sh
```

This will:
- Start the application with Keploy recording
- Display instructions for making API calls
- Record all interactions as test cases

### 4. Generate Test Data

In another terminal, while recording is active:

```bash
# Generate comprehensive API test calls
bash scripts/generate-test-calls.sh
```

This script tests all endpoints:
- ✅ GET `/health` - Health check
- ✅ GET `/api/weather` - Get all weather data
- ✅ GET `/api/weather/:city` - Get weather by city
- ✅ POST `/api/weather` - Add new weather data
- ✅ PUT `/api/weather/:id` - Update weather data
- ✅ DELETE `/api/weather/:id` - Delete weather data
- ✅ GET `/api/weather/search/:query` - Search weather data
- ❌ Error cases and edge scenarios

### 5. Run Tests

```bash
# Run the recorded tests
bash scripts/keploy-test.sh
```

## 🔧 Configuration Files

### OpenAPI Specification (`openapi.yaml`)

Complete OpenAPI 3.0 specification including:
- All API endpoints and operations
- Request/response schemas
- Error handling
- Authentication (if applicable)
- Examples and documentation

### Keploy Configuration (`keploy.yml`)

```yaml
version: api.keploy.io/v1beta1
kind: config
metadata:
  name: weather-api-config
  
spec:
  path: "./tests/keploy"
  command: "node server.js"
  port: 3000
  
test:
  globalNoise:
    global:
      body: {
        "created_at": [],
        "updated_at": [],
        "timestamp": []
      }

contract:
  schema: "./openapi.yaml"
```

## 🚀 CI/CD Integration

### GitHub Actions Workflow

The project includes a comprehensive GitHub Actions workflow (`.github/workflows/keploy-api-testing.yml`) that:

1. **🧪 API Testing**:
   - Runs existing Jest/Mocha tests
   - Builds Docker container
   - Starts API server
   - Installs Keploy CLI
   - Records API interactions
   - Runs Keploy tests
   - Generates test reports

2. **🔒 Security Scanning**:
   - NPM security audit
   - Docker image vulnerability scan

3. **🚀 Deployment Ready**:
   - Validates all tests pass
   - Marks deployment readiness

### Triggers

- ✅ Push to `main` or `develop` branches
- ✅ Pull requests to `main`
- ✅ Manual workflow dispatch

## 📊 Test Coverage

### API Endpoints Tested

| Method | Endpoint | Description | Status |
|--------|----------|-------------|---------|
| GET | `/health` | Health check | ✅ |
| GET | `/` | API information | ✅ |
| GET | `/api/weather` | Get all weather data | ✅ |
| GET | `/api/weather/:city` | Get weather by city | ✅ |
| POST | `/api/weather` | Add new weather data | ✅ |
| PUT | `/api/weather/:id` | Update weather data | ✅ |
| DELETE | `/api/weather/:id` | Delete weather data | ✅ |
| GET | `/api/weather/search/:query` | Search weather data | ✅ |

### Test Scenarios

- ✅ **Happy Path**: All successful operations
- ✅ **Error Handling**: 404, 400, 409, 500 errors
- ✅ **Edge Cases**: Invalid data, missing fields
- ✅ **Performance**: Response time validation
- ✅ **Data Validation**: Schema compliance

## 🎯 Benefits of Keploy Integration

### 🤖 AI-Powered Testing
- Automatically generates intelligent test cases
- Learns from real API usage patterns
- Creates comprehensive test coverage

### 🔄 Zero Configuration
- No manual test writing required
- Tests generated from actual usage
- Maintains test suite automatically

### 🚀 CI/CD Ready
- Integrated into GitHub Actions
- Automated testing on every commit
- Deployment gate with test validation

### 📊 Comprehensive Reporting
- Detailed test results
- Performance metrics
- Coverage analysis

## 🛠️ Advanced Usage

### Custom Test Recording

```bash
# Record specific endpoints
curl -X GET http://localhost:3000/api/weather \
  -H "Accept: application/json"

# Record with custom headers
curl -X POST http://localhost:3000/api/weather \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-api-key" \
  -d '{"city": "Miami", "temperature": 28.5}'
```

### Manual Keploy Commands

```bash
# Record mode
keploy record -c "node server.js"

# Test mode
keploy test -c "node server.js"

# Generate test cases
keploy gen -t "integration"
```

## 🐛 Troubleshooting

### Common Issues

1. **Docker not running**
   ```bash
   # Start Docker service
   sudo systemctl start docker  # Linux
   # or use Docker Desktop on Mac/Windows
   ```

2. **Permission denied**
   ```bash
   # Make scripts executable
   chmod +x scripts/*.sh
   ```

3. **Port already in use**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   ```

4. **Keploy installation issues**
   ```bash
   # Manual installation
   curl -O https://github.com/keploy/keploy/releases/latest/download/keploy_linux_amd64.tar.gz
   tar -xzf keploy_linux_amd64.tar.gz
   sudo mv keploy /usr/local/bin/
   ```

## 📈 Next Steps

1. **🎯 Run the setup**: `bash scripts/setup-keploy.sh`
2. **📋 Record tests**: `bash scripts/keploy-record.sh`
3. **🧪 Execute tests**: `bash scripts/keploy-test.sh`
4. **🚀 Push to GitHub**: Trigger CI/CD pipeline
5. **📊 Review results**: Check GitHub Actions results
6. **✨ Submit**: Add screenshots to README

## 🔗 Resources

- [Keploy Documentation](https://docs.keploy.io/)
- [Keploy GitHub](https://github.com/keploy/keploy)
- [OpenAPI Specification](https://swagger.io/specification/)
- [Docker Documentation](https://docs.docker.com/)

## 🏆 Task Completion Checklist

- [x] ✅ **Create OpenAPI Schema** - `openapi.yaml` created with full API specification
- [x] ✅ **API Testing using AI** - Keploy integration with recording and testing scripts
- [x] ✅ **Integrate into CI/CD** - GitHub Actions workflow with automated testing
- [ ] 🎯 **Ensure Pipeline Passes** - Run pipeline and verify success
- [ ] 📊 **Submit** - Screenshot test reports and share GitHub repository

---

**Ready to test your API with AI? Run `bash scripts/setup-keploy.sh` to get started!** 🚀 