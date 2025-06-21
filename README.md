# Weather API 🌤️

A comprehensive weather data API server built with Node.js, Express, and SQLite, featuring both a classic HTML frontend and a modern Next.js frontend with React and TypeScript.

## 🚀 Features

- **Custom RESTful API** with 6 endpoints for weather data management
- **SQLite Database** for persistent data storage
- **Two Frontend Options**: Classic HTML and Modern Next.js with React
- **Comprehensive Testing** suite with automated API tests
- **Complete CRUD Operations** (Create, Read, Update, Delete)
- **Search Functionality** for weather data
- **Input Validation** and error handling
- **Responsive Design** that works on all devices

## 📊 API Endpoints

### 1. GET `/api/weather`
- **Description**: Retrieve all weather data
- **Method**: GET
- **Response**: Array of weather objects with success status and count
- **Example Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "city": "London",
      "temperature": 18.3,
      "humidity": 72,
      "pressure": 1008.5,
      "description": "Light rain",
      "wind_speed": 12.8,
      "visibility": 8.5,
      "created_at": "2024-01-01 10:00:00",
      "updated_at": "2024-01-01 10:00:00"
    }
  ],
  "count": 1
}
```

### 2. GET `/api/weather/:city`
- **Description**: Get weather data for a specific city
- **Method**: GET
- **Parameters**: `city` (string) - City name
- **Example**: `/api/weather/London`
- **Response**: Single weather object
```json
{
  "success": true,
  "data": {
    "id": 1,
    "city": "London",
    "temperature": 18.3,
    "humidity": 72,
    "pressure": 1008.5,
    "description": "Light rain",
    "wind_speed": 12.8,
    "visibility": 8.5,
    "created_at": "2024-01-01 10:00:00",
    "updated_at": "2024-01-01 10:00:00"
  }
}
```

### 3. POST `/api/weather`
- **Description**: Add new weather data
- **Method**: POST
- **Content-Type**: `application/json`
- **Body Parameters**:
  - `city` (string, required) - City name
  - `temperature` (number, required) - Temperature in Celsius
  - `humidity` (integer, required) - Humidity percentage (0-100)
  - `pressure` (number, required) - Atmospheric pressure in hPa
  - `description` (string, required) - Weather description
  - `wind_speed` (number, required) - Wind speed in km/h
  - `visibility` (number, required) - Visibility in kilometers
- **Example Request**:
```json
{
  "city": "Barcelona",
  "temperature": 24.5,
  "humidity": 65,
  "pressure": 1015.2,
  "description": "Sunny",
  "wind_speed": 12.3,
  "visibility": 15.0
}
```
- **Response**:
```json
{
  "success": true,
  "message": "Weather data added successfully",
  "data": {
    "id": 6,
    "city": "Barcelona",
    "temperature": 24.5,
    "humidity": 65,
    "pressure": 1015.2,
    "description": "Sunny",
    "wind_speed": 12.3,
    "visibility": 15.0
  }
}
```

### 4. PUT `/api/weather/:id`
- **Description**: Update weather data by ID
- **Method**: PUT
- **Parameters**: `id` (integer) - Weather record ID
- **Content-Type**: `application/json`
- **Body**: Same as POST request
- **Example**: `/api/weather/1`
- **Response**:
```json
{
  "success": true,
  "message": "Weather data updated successfully",
  "data": {
    "id": 1,
    "city": "London",
    "temperature": 20.0,
    "humidity": 70,
    "pressure": 1010.0,
    "description": "Cloudy",
    "wind_speed": 15.0,
    "visibility": 10.0
  }
}
```

### 5. DELETE `/api/weather/:id`
- **Description**: Delete weather data by ID
- **Method**: DELETE
- **Parameters**: `id` (integer) - Weather record ID
- **Example**: `/api/weather/1`
- **Response**:
```json
{
  "success": true,
  "message": "Weather data with ID 1 deleted successfully"
}
```

### 6. GET `/api/weather/search/:query`
- **Description**: Search weather data by city name (partial matching)
- **Method**: GET
- **Parameters**: `query` (string) - Search term
- **Example**: `/api/weather/search/lon` (finds "London")
- **Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "city": "London",
      "temperature": 18.3,
      "humidity": 72,
      "pressure": 1008.5,
      "description": "Light rain",
      "wind_speed": 12.8,
      "visibility": 8.5,
      "created_at": "2024-01-01 10:00:00",
      "updated_at": "2024-01-01 10:00:00"
    }
  ],
  "count": 1,
  "query": "lon"
}
```

### Additional Endpoints

#### Health Check
- **GET `/health`** - Server health check
- **Response**:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "uptime": 3600
}
```

## 🗄️ Database Schema

The application uses SQLite with the following schema:

```sql
CREATE TABLE weather_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    city TEXT NOT NULL UNIQUE,
    temperature REAL NOT NULL,
    humidity INTEGER NOT NULL,
    pressure REAL NOT NULL,
    description TEXT NOT NULL,
    wind_speed REAL NOT NULL,
    visibility REAL NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Sample Data
The application includes sample data for these cities:
- New York
- London
- Tokyo
- Sydney
- Paris

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (version 14 or higher)
- npm (Node Package Manager)

### Installation Steps

1. **Clone or download the project**
```bash
git clone <repository-url>
cd WeatherAPI
```

2. **Install API server dependencies**
```bash
npm install
```

3. **Start the API server**
```bash
npm start
```

The API server will start on `http://localhost:3000`

## 🌐 Frontend Options

You have two frontend options to choose from:

### Option 1: Classic HTML Frontend (Simple)
- Open your browser and go to `http://localhost:3000`
- Uses the static HTML file in the `public/` directory
- Simple and lightweight

### Option 2: Modern Next.js Frontend (Recommended)

1. **Navigate to the frontend directory:**
```bash
cd weather-frontend
```

2. **Install frontend dependencies:**
```bash
npm install
```

3. **Start the Next.js development server:**
```bash
npm run dev
```

4. **Open your browser and visit:**
```
http://localhost:3001
```

#### Next.js Frontend Features:
- **Modern UI**: Built with Next.js 14, React, TypeScript, and Tailwind CSS
- **Responsive Design**: Works perfectly on desktop and mobile
- **Real-time Updates**: Live data synchronization
- **Type Safety**: Full TypeScript integration
- **Better Performance**: Optimized React components
- **Modern Development**: Hot reloading and better developer experience

## 📱 Frontend Usage

Both frontends provide the same functionality:

### View Weather Data
- Browse all weather data with search functionality
- Interactive cards showing weather details
- Real-time search and filtering

### Add Weather Data
- Complete forms with validation
- All weather parameters supported
- Success/error feedback

### Update Weather Data
- Select and update existing weather data
- Real-time form validation
- Instant updates

### API Documentation
- Complete API documentation
- Request/response examples
- Interactive testing interface

## 🧪 Testing

The project includes comprehensive automated tests for all API endpoints.

### Run Tests
1. **Start the API server** (in one terminal):
```bash
npm start
```

2. **Run tests** (in another terminal):
```bash
npm test
# or
./test-api.sh
```

### Test Coverage
The test suite covers:
- ✅ Health endpoint functionality
- ✅ GET all weather data
- ✅ GET weather by city (existing and non-existent)
- ✅ POST new weather data
- ✅ POST duplicate data (error handling)
- ✅ POST invalid data (validation)
- ✅ PUT update weather data
- ✅ DELETE weather data
- ✅ Search functionality
- ✅ Invalid endpoint handling

## 🔧 Manual Testing with cURL

You can also test the API endpoints manually using cURL:

### Get all weather data
```bash
curl -X GET http://localhost:3000/api/weather
```

### Get weather for a specific city
```bash
curl -X GET http://localhost:3000/api/weather/London
```

### Add new weather data
```bash
curl -X POST http://localhost:3000/api/weather \
  -H "Content-Type: application/json" \
  -d '{
    "city": "Madrid",
    "temperature": 26.0,
    "humidity": 60,
    "pressure": 1016.5,
    "description": "Sunny",
    "wind_speed": 8.2,
    "visibility": 20.0
  }'
```

### Update weather data
```bash
curl -X PUT http://localhost:3000/api/weather/1 \
  -H "Content-Type: application/json" \
  -d '{
    "city": "London",
    "temperature": 22.0,
    "humidity": 68,
    "pressure": 1012.0,
    "description": "Partly cloudy",
    "wind_speed": 10.5,
    "visibility": 12.0
  }'
```

### Delete weather data
```bash
curl -X DELETE http://localhost:3000/api/weather/1
```

### Search weather data
```bash
curl -X GET http://localhost:3000/api/weather/search/lon
```

## 📁 Project Structure

```
WeatherAPI/
├── server.js              # Main API server with endpoints
├── package.json           # API server dependencies and scripts
├── test.js               # Comprehensive test suite
├── test-api.sh           # Manual testing script
├── README.md             # This file
├── weather.db            # SQLite database (created automatically)
└── weather-frontend/     # Modern Next.js frontend
    ├── src/
    │   ├── app/          # Next.js app directory
    │   ├── components/   # React components
    │   ├── types/        # TypeScript types
    │   └── lib/          # Utility functions
    ├── package.json      # Frontend dependencies
    └── README.md         # Frontend documentation
```

## 🔒 Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input data or missing required fields
- **404 Not Found**: Resource not found (city or weather ID)
- **409 Conflict**: Attempting to create duplicate city data
- **500 Internal Server Error**: Database or server errors

All errors return a consistent JSON format:
```json
{
  "success": false,
  "message": "Error description"
}
```

## 🌟 Key Features Implemented

### ✅ Mandatory Requirements
- [x] **Custom API**: 6 different endpoints (exceeding the required 4)
- [x] **Database Integration**: SQLite with full CRUD operations
- [x] **Testing**: Comprehensive automated test suite
- [x] **Documentation**: Complete API documentation

### ✅ Optional Requirements
- [x] **Frontend**: Two frontend options (HTML + Next.js React)
- [x] **API Documentation**: Built-in documentation interface
- [x] **Advanced Features**: Search, validation, error handling

## 🚀 Advanced Features

1. **Search Functionality**: Partial matching search across city names
2. **Input Validation**: Comprehensive validation for all endpoints
3. **Responsive Design**: Mobile-first frontend design
4. **Real-time Updates**: Frontend automatically refreshes data
5. **Error Handling**: Graceful error handling throughout the application
6. **Health Monitoring**: Server health check endpoint
7. **Automated Testing**: Complete test coverage for all endpoints
8. **Modern Frontend**: Next.js with React, TypeScript, and Tailwind CSS
9. **Type Safety**: Full TypeScript integration in the frontend

## 🤝 Development Workflow

### For API Development:
1. Start the API server: `npm start`
2. Run tests: `npm test`
3. Use manual testing script: `./test-api.sh`

### For Frontend Development:
1. Start the API server: `npm start`
2. In another terminal, start the frontend:
```bash
cd weather-frontend
npm run dev
```
3. Access the modern frontend at `http://localhost:3001`

## 💡 Future Enhancements

Potential improvements that could be added:
- User authentication and authorization
- Rate limiting for API endpoints
- Weather data history and trends
- Integration with external weather APIs
- Data visualization charts
- Email notifications for weather alerts
- API versioning
- Docker containerization
- Deployment configuration
- Real-time WebSocket updates

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## 📜 License

This project is licensed under the MIT License - see the package.json file for details.

## 📞 Support

If you encounter any issues or have questions:
1. Check the test results with `npm test`
2. Verify the API server is running on `http://localhost:3000`
3. For the Next.js frontend, check `http://localhost:3001`
4. Check the browser console for any frontend errors
5. Review the API documentation

---

**Built with ❤️ using Node.js, Express, SQLite, React, Next.js, TypeScript, and Tailwind CSS.** 