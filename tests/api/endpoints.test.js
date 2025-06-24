const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');

// Create a test version of the server
let app;
let server;
let db;
const testDbPath = './test-api-weather.db';

beforeAll(async () => {
  // Setup test database and server
  app = express();
  
  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  // Initialize test database
  db = new sqlite3.Database(testDbPath);
  
  // Wait for database initialization
  await new Promise((resolve, reject) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS weather_data (
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
      )
    `;
    
    db.run(createTableQuery, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });

  // Add sample data
  await new Promise((resolve, reject) => {
    const sampleData = [
      ['New York', 22.5, 65, 1013.25, 'Partly cloudy', 15.2, 10.0],
      ['London', 18.3, 72, 1008.5, 'Light rain', 12.8, 8.5],
      ['Tokyo', 28.7, 58, 1015.8, 'Sunny', 8.4, 15.0]
    ];

    const insertQuery = `
      INSERT OR IGNORE INTO weather_data 
      (city, temperature, humidity, pressure, description, wind_speed, visibility) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    let completed = 0;
    sampleData.forEach(data => {
      db.run(insertQuery, data, (err) => {
        if (err) reject(err);
        completed++;
        if (completed === sampleData.length) resolve();
      });
    });
  });

  // Define API routes
  setupRoutes();
});

afterAll(async () => {
  // Clean up
  if (db) {
    await new Promise((resolve) => {
      db.close(resolve);
    });
  }
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
  if (server) {
    server.close();
  }
});

function setupRoutes() {
  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      message: 'Weather API Server',
      version: '1.0.0',
      endpoints: {
        'GET /api/weather': 'Get all weather data',
        'GET /api/weather/:city': 'Get weather data by city',
        'POST /api/weather': 'Add new weather data',
        'PUT /api/weather/:id': 'Update weather data by ID',
        'DELETE /api/weather/:id': 'Delete weather data by ID',
        'GET /api/weather/search/:query': 'Search weather data by city name'
      }
    });
  });

  // Health check
  app.get('/health', (req, res) => {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  });

  // Get all weather data
  app.get('/api/weather', (req, res) => {
    const query = `
      SELECT id, city, temperature, humidity, pressure, description, 
             wind_speed, visibility, created_at, updated_at 
      FROM weather_data 
      ORDER BY city ASC
    `;
    
    db.all(query, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        success: true,
        data: rows,
        count: rows.length
      });
    });
  });

  // Get weather by city
  app.get('/api/weather/:city', (req, res) => {
    const city = req.params.city;
    const query = `
      SELECT id, city, temperature, humidity, pressure, description, 
             wind_speed, visibility, created_at, updated_at 
      FROM weather_data 
      WHERE LOWER(city) = LOWER(?)
    `;
    
    db.get(query, [city], (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (row) {
        res.json({
          success: true,
          data: row
        });
      } else {
        res.status(404).json({
          success: false,
          message: `Weather data not found for city: ${city}`
        });
      }
    });
  });

  // Add new weather data
  app.post('/api/weather', (req, res) => {
    const { city, temperature, humidity, pressure, description, wind_speed, visibility } = req.body;
    
    if (!city || temperature === undefined || humidity === undefined || 
        pressure === undefined || !description || wind_speed === undefined || 
        visibility === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: city, temperature, humidity, pressure, description, wind_speed, visibility'
      });
    }
    
    const insertQuery = `
      INSERT INTO weather_data (city, temperature, humidity, pressure, description, wind_speed, visibility)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    db.run(insertQuery, [city, temperature, humidity, pressure, description, wind_speed, visibility], function(err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          res.status(409).json({
            success: false,
            message: `Weather data for ${city} already exists. Use PUT to update.`
          });
        } else {
          res.status(500).json({ error: err.message });
        }
        return;
      }
      res.status(201).json({
        success: true,
        message: 'Weather data added successfully',
        data: {
          id: this.lastID,
          city,
          temperature,
          humidity,
          pressure,
          description,
          wind_speed,
          visibility
        }
      });
    });
  });

  // Update weather data
  app.put('/api/weather/:id', (req, res) => {
    const id = req.params.id;
    const { city, temperature, humidity, pressure, description, wind_speed, visibility } = req.body;
    
    if (!city || temperature === undefined || humidity === undefined || 
        pressure === undefined || !description || wind_speed === undefined || 
        visibility === undefined) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required: city, temperature, humidity, pressure, description, wind_speed, visibility'
      });
    }
    
    const updateQuery = `
      UPDATE weather_data 
      SET city = ?, temperature = ?, humidity = ?, pressure = ?, 
          description = ?, wind_speed = ?, visibility = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    db.run(updateQuery, [city, temperature, humidity, pressure, description, wind_speed, visibility, id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({
          success: false,
          message: `Weather data with ID ${id} not found`
        });
      } else {
        res.json({
          success: true,
          message: 'Weather data updated successfully',
          data: {
            id: parseInt(id),
            city,
            temperature,
            humidity,
            pressure,
            description,
            wind_speed,
            visibility
          }
        });
      }
    });
  });

  // Delete weather data
  app.delete('/api/weather/:id', (req, res) => {
    const id = req.params.id;
    const deleteQuery = 'DELETE FROM weather_data WHERE id = ?';
    
    db.run(deleteQuery, [id], function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (this.changes === 0) {
        res.status(404).json({
          success: false,
          message: `Weather data with ID ${id} not found`
        });
      } else {
        res.json({
          success: true,
          message: `Weather data with ID ${id} deleted successfully`
        });
      }
    });
  });

  // Search weather data
  app.get('/api/weather/search/:query', (req, res) => {
    const searchQuery = req.params.query;
    const query = `
      SELECT id, city, temperature, humidity, pressure, description, 
             wind_speed, visibility, created_at, updated_at 
      FROM weather_data 
      WHERE LOWER(city) LIKE LOWER(?)
      ORDER BY city ASC
    `;
    
    db.all(query, [`%${searchQuery}%`], (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        success: true,
        data: rows,
        count: rows.length,
        query: searchQuery
      });
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found'
    });
  });
}

describe('Weather API Endpoints', () => {
  describe('GET /', () => {
    test('should return API information', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Weather API Server');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /health', () => {
    test('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('GET /api/weather', () => {
    test('should return all weather data', async () => {
      const response = await request(app).get('/api/weather');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    test('should return weather data in correct format', async () => {
      const response = await request(app).get('/api/weather');
      expect(response.status).toBe(200);
      
      if (response.body.data.length > 0) {
        const weatherItem = response.body.data[0];
        expect(weatherItem).toHaveProperty('id');
        expect(weatherItem).toHaveProperty('city');
        expect(weatherItem).toHaveProperty('temperature');
        expect(weatherItem).toHaveProperty('humidity');
        expect(weatherItem).toHaveProperty('pressure');
        expect(weatherItem).toHaveProperty('description');
        expect(weatherItem).toHaveProperty('wind_speed');
        expect(weatherItem).toHaveProperty('visibility');
      }
    });
  });

  describe('GET /api/weather/:city', () => {
    test('should return weather data for existing city', async () => {
      const response = await request(app).get('/api/weather/London');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.city).toBe('London');
    });

    test('should return 404 for non-existing city', async () => {
      const response = await request(app).get('/api/weather/NonExistentCity');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });

    test('should be case insensitive', async () => {
      const response = await request(app).get('/api/weather/LONDON');
      expect(response.status).toBe(200);
      expect(response.body.data.city).toBe('London');
    });
  });

  describe('POST /api/weather', () => {
    test('should create new weather data', async () => {
      const newWeatherData = {
        city: 'Test City',
        temperature: 25.5,
        humidity: 60,
        pressure: 1013.25,
        description: 'Sunny',
        wind_speed: 10.5,
        visibility: 15.0
      };

      const response = await request(app)
        .post('/api/weather')
        .send(newWeatherData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Weather data added successfully');
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.city).toBe(newWeatherData.city);
      expect(response.body.data.temperature).toBe(newWeatherData.temperature);
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteData = {
        city: 'Incomplete City',
        temperature: 25.5
        // Missing other required fields
      };

      const response = await request(app)
        .post('/api/weather')
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toContain('All fields are required');
    });

    test('should return 409 for duplicate city', async () => {
      const duplicateData = {
        city: 'London', // Already exists
        temperature: 20.0,
        humidity: 70,
        pressure: 1010.0,
        description: 'Cloudy',
        wind_speed: 12.0,
        visibility: 10.0
      };

      const response = await request(app)
        .post('/api/weather')
        .send(duplicateData);

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('already exists');
    });
  });

  describe('PUT /api/weather/:id', () => {
    let testWeatherId;

    beforeAll(async () => {
      // Create a test record first
      const testData = {
        city: 'Update Test City',
        temperature: 20.0,
        humidity: 50,
        pressure: 1012.0,
        description: 'Clear',
        wind_speed: 5.0,
        visibility: 20.0
      };

      const createResponse = await request(app)
        .post('/api/weather')
        .send(testData);

      testWeatherId = createResponse.body.data.id;
    });

    test('should update existing weather data', async () => {
      const updatedData = {
        city: 'Updated Test City',
        temperature: 30.0,
        humidity: 40,
        pressure: 1015.0,
        description: 'Hot',
        wind_speed: 8.0,
        visibility: 25.0
      };

      const response = await request(app)
        .put(`/api/weather/${testWeatherId}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Weather data updated successfully');
      expect(response.body.data.city).toBe(updatedData.city);
      expect(response.body.data.temperature).toBe(updatedData.temperature);
    });

    test('should return 404 for non-existing ID', async () => {
      const updatedData = {
        city: 'Non-existent City',
        temperature: 25.0,
        humidity: 60,
        pressure: 1013.0,
        description: 'Sunny',
        wind_speed: 10.0,
        visibility: 15.0
      };

      const response = await request(app)
        .put('/api/weather/99999')
        .send(updatedData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('not found');
    });

    test('should return 400 for missing required fields', async () => {
      const incompleteData = {
        city: 'Incomplete Update'
        // Missing other required fields
      };

      const response = await request(app)
        .put(`/api/weather/${testWeatherId}`)
        .send(incompleteData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('All fields are required');
    });
  });

  describe('DELETE /api/weather/:id', () => {
    let testWeatherId;

    beforeEach(async () => {
      // Create a test record for each delete test
      const testData = {
        city: `Delete Test City ${Date.now()}`,
        temperature: 22.0,
        humidity: 55,
        pressure: 1011.0,
        description: 'Mild',
        wind_speed: 7.0,
        visibility: 18.0
      };

      const createResponse = await request(app)
        .post('/api/weather')
        .send(testData);

      testWeatherId = createResponse.body.data.id;
    });

    test('should delete existing weather data', async () => {
      const response = await request(app)
        .delete(`/api/weather/${testWeatherId}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.message).toContain('deleted successfully');
    });

    test('should return 404 for non-existing ID', async () => {
      const response = await request(app)
        .delete('/api/weather/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('GET /api/weather/search/:query', () => {
    test('should return search results for partial city name', async () => {
      const response = await request(app).get('/api/weather/search/Lon');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('query', 'Lon');
      expect(Array.isArray(response.body.data)).toBe(true);
      
      // Should find London
      const londonResult = response.body.data.find(item => item.city === 'London');
      expect(londonResult).toBeDefined();
    });

    test('should return empty results for non-matching query', async () => {
      const response = await request(app).get('/api/weather/search/xyz123');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveLength(0);
      expect(response.body.count).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should return 404 for invalid endpoints', async () => {
      const response = await request(app).get('/api/invalid');
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('not found');
    });

    test('should handle malformed JSON', async () => {
      const response = await request(app)
        .post('/api/weather')
        .set('Content-Type', 'application/json')
        .send('invalid json');

      expect(response.status).toBe(400);
    });
  });
}); 