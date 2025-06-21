# Weather API 🌤️

A comprehensive weather data API server built with Node.js, Express, and SQLite, featuring both a classic HTML frontend and a modern Next.js frontend with React and TypeScript.

## 🚀 Quick Start

### Option 1: Start Everything at Once (Recommended)
```bash
# Start both API server and Next.js frontend
./start-all.sh
```
- API Server: `http://localhost:3000`
- Modern Frontend: `http://localhost:3001`

### Option 2: Start Components Separately
```bash
# Terminal 1: Start API server
npm start

# Terminal 2: Start Next.js frontend
cd weather-frontend && npm run dev
```

### Option 3: API Only
```bash
npm start
# API server only at http://localhost:3000
```

## ✨ Features

- **Custom RESTful API** with 6 endpoints for weather data management
- **SQLite Database** for persistent data storage with automatic setup
- **Modern Next.js Frontend** with React, TypeScript, and Tailwind CSS
- **Comprehensive Testing** suite with automated API tests
- **Complete CRUD Operations** (Create, Read, Update, Delete)
- **Search Functionality** for weather data
- **Input Validation** and comprehensive error handling
- **Responsive Design** that works on all devices
- **Type Safety** with full TypeScript integration

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
- **Node.js** (version 16 or higher recommended)
- **npm** (comes with Node.js)

### Quick Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd WeatherAPI
```

2. **Install all dependencies**
```bash
# Install API server dependencies
npm install

# Install frontend dependencies
cd weather-frontend
npm install
cd ..
```

3. **Start the application**
```bash
# Option 1: Start everything at once
./start-all.sh

# Option 2: Start API server only
npm start

# Option 3: Start both manually
npm start                              # Terminal 1
cd weather-frontend && npm run dev     # Terminal 2
```

4. **Access the application**
- **Frontend**: `http://localhost:3001`
- **API Server**: `http://localhost:3000`

### Initial Database Setup
The SQLite database (`weather.db`) is created automatically on first startup with sample data for:
- New York, London, Tokyo, Sydney, Paris

## 🌐 Frontend

### 🎨 Next.js Frontend
**URL**: `http://localhost:3001`

**Features**:
- **Next.js 15** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **React Hook Form** with Zod validation
- **Real-time updates** and live data synchronization
- **Responsive design** optimized for all devices
- **Dark/light theme** support
- **Form validation** with user-friendly error messages

**Tech Stack**:
- Next.js 15.3.4
- React 19.0.0
- TypeScript 5.x
- Tailwind CSS 3.4.1
- Radix UI Components
- Lucide Icons
- React Hook Form + Zod

## 📱 Frontend Usage

The Next.js frontend provides comprehensive functionality:

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

### Automated Testing
```bash
# Start the API server first
npm start

# Run the test suite (in another terminal)
npm test
# or
./test-api.sh
```

### Manual Testing
```bash
# Test all endpoints interactively
./test-api.sh
```

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
├── 📄 server.js              # Main API server with Express routes
├── 📄 package.json           # Backend dependencies and scripts
├── 📄 start-all.sh          # Script to start both API and frontend
├── 📄 test-api.sh           # Comprehensive API testing script
├── 📄 README.md             # This documentation
├── 🗄️ weather.db            # SQLite database (auto-created)
├── 📄 .gitignore            # Git ignore patterns
└── 📁 weather-frontend/     # Modern Next.js frontend
    ├── 📄 package.json      # Frontend dependencies
    ├── 📄 next.config.ts    # Next.js configuration
    ├── 📄 tailwind.config.ts # Tailwind CSS configuration
    ├── 📄 tsconfig.json     # TypeScript configuration
    ├── 📁 src/
    │   ├── 📁 app/          # Next.js 14 app directory
    │   │   ├── 📄 layout.tsx
    │   │   ├── 📄 page.tsx
    │   │   └── 📄 globals.css
    │   ├── 📁 components/   # React components
    │   │   ├── 📄 WeatherDashboard.tsx
    │   │   ├── 📄 WeatherCard.tsx
    │   │   ├── 📄 AddWeatherForm.tsx
    │   │   ├── 📄 UpdateWeatherForm.tsx
    │   │   ├── 📄 WeatherList.tsx
    │   │   ├── 📄 ApiDocumentation.tsx
    │   │   └── 📁 ui/       # Reusable UI components
    │   ├── 📁 lib/          # Utility functions
    │   │   ├── 📄 api.ts    # API client functions
    │   │   └── 📄 utils.ts  # Helper utilities
    │   └── 📁 types/        # TypeScript type definitions
    │       └── 📄 weather.ts
    └── 📁 public/           # Static assets
```

## 🔧 Development Scripts

### Backend (Root Directory)
```bash
npm start          # Start production server
npm run dev        # Start with nodemon (development)
npm test           # Run API tests
```

### Frontend (weather-frontend/)
```bash
npm run dev        # Start Next.js development server
npm run build      # Build for production
npm start          # Start production server
npm run lint       # Run ESLint
```

### Utility Scripts
```bash
./start-all.sh     # Start both API and frontend
./test-api.sh      # Run comprehensive API tests
```

## 🌟 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** 4.18.2 - Web framework
- **SQLite3** 5.1.6 - Database
- **CORS** 2.8.5 - Cross-origin requests
- **Body-parser** 1.20.2 - Request parsing

### Frontend
- **Next.js** 15.3.4 - React framework
- **React** 19.0.0 - UI library
- **TypeScript** 5.x - Type safety
- **Tailwind CSS** 3.4.1 - Styling
- **Radix UI** - Accessible components
- **React Hook Form** 7.58.1 - Form handling
- **Zod** 3.25.67 - Schema validation
- **Lucide React** - Icons

## 🔒 Security & Validation

### API Security
- **CORS** enabled for cross-origin requests
- **Input validation** on all endpoints
- **SQL injection protection** via parameterized queries
- **Error handling** without exposing internal details

### Frontend Security
- **TypeScript** for compile-time safety
- **Zod schemas** for runtime validation
- **Sanitized inputs** in all forms
- **Client-side validation** with server-side backup

## 🚀 Deployment

### Environment Variables
Create a `.env` file for production:
```bash
NODE_ENV=production
PORT=3000
DATABASE_PATH=./weather.db
```

### Production Build
```bash
# Build frontend
cd weather-frontend
npm run build

# Start production servers
npm start                    # API server
npm start -p 3001           # Frontend server
```

## 🤝 Development Workflow

### For New Features:
1. **Start development environment**:
   ```bash
   ./start-all.sh
   ```

2. **Make changes** to backend (`server.js`) or frontend (`weather-frontend/src/`)

3. **Test your changes**:
   ```bash
   npm test
   ```

4. **Check frontend** at `http://localhost:3001`

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "Add new feature"
   ```

### For API Development:
- Server auto-restarts with `npm run dev`
- Test with `./test-api.sh`
- Access API docs at `http://localhost:3000/api`

### For Frontend Development:
- Hot reloading with `npm run dev`
- TypeScript checking in real-time
- Access at `http://localhost:3001`

## 💡 Future Enhancements

**Planned Features:**
- [ ] User authentication and sessions
- [ ] API rate limiting
- [ ] Weather data history and trends
- [ ] Integration with live weather APIs
- [ ] Data visualization charts
- [ ] Email/SMS notifications
- [ ] API versioning (v2)
- [ ] Docker containerization
- [ ] Cloud deployment guides
- [ ] WebSocket real-time updates

**Technical Improvements:**
- [ ] Add more comprehensive tests
- [ ] Implement caching layer
- [ ] Add API documentation with Swagger
- [ ] Performance monitoring
- [ ] Logging system
- [ ] Database migrations

## 🐛 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Kill processes on ports 3000 or 3001
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

**Database Issues:**
```bash
# Remove and recreate database
rm weather.db
npm start  # Database will be recreated
```

**Dependencies Issues:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Frontend dependencies
cd weather-frontend
rm -rf node_modules package-lock.json
npm install
```

**Frontend Build Issues:**
```bash
cd weather-frontend
rm -rf .next
npm run build
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make** your changes
4. **Test** thoroughly:
   ```bash
   npm test
   ./test-api.sh
   ```
5. **Commit** your changes:
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push** to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Create** a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure responsive design
- Test on multiple browsers

## 📞 Support

**Need Help?**

1. **Check the issues** first: Run `npm test` to verify setup
2. **API Server**: Ensure it's running on `http://localhost:3000`
3. **Frontend**: Check `http://localhost:3001` is accessible
4. **Browser Console**: Look for JavaScript errors
5. **Network Tab**: Verify API calls are successful

**Contact:**
- Create an issue on GitHub
- Check existing documentation
- Review test results for debugging

## 📜 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by real-world weather applications
- Community-driven development
- Open source contributions welcome

---

**🌟 Built with passion using Node.js, Express, SQLite, React, Next.js, TypeScript, and Tailwind CSS.**

*Happy coding! 🚀* 