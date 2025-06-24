const request = require('supertest');
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

describe('Server-Database Integration Tests', () => {
  let app;
  let db;
  const testDbPath = './test-integration-weather.db';

  beforeAll(async () => {
    // Setup complete server with real database
    app = express();
    
    // Middleware
    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Initialize database (using actual file-based database for integration testing)
    db = new sqlite3.Database(testDbPath);
    
    // Initialize database schema
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

    // Add initial test data
    await new Promise((resolve, reject) => {
      const sampleData = [
        ['Berlin', 15.2, 78, 1009.1, 'Overcast', 14.5, 8.2],
        ['Madrid', 32.1, 45, 1018.3, 'Sunny', 6.8, 20.0],
        ['Rome', 28.4, 62, 1014.7, 'Partly cloudy', 11.2, 16.5]
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

    setupAPIRoutes();
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
  });

  beforeEach(async () => {
    // Clear any test data that might have been added during tests
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM weather_data WHERE city LIKE 'Integration Test%'", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });

  function setupAPIRoutes() {
    // API Routes (exactly as in the main server)
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
  }

  describe('Complete CRUD Workflow Integration', () => {
    test('should complete full weather data lifecycle', async () => {
      const testCity = 'Integration Test City';
      
      // 1. CREATE: Add new weather data
      const newWeatherData = {
        city: testCity,
        temperature: 24.5,
        humidity: 55,
        pressure: 1016.2,
        description: 'Clear sky',
        wind_speed: 8.7,
        visibility: 18.5
      };

      const createResponse = await request(app)
        .post('/api/weather')
        .send(newWeatherData);

      expect(createResponse.status).toBe(201);
      expect(createResponse.body.success).toBe(true);
      const createdId = createResponse.body.data.id;
      expect(createdId).toBeDefined();

      // 2. READ: Verify data was created correctly
      const readResponse = await request(app)
        .get(`/api/weather/${testCity}`);

      expect(readResponse.status).toBe(200);
      expect(readResponse.body.success).toBe(true);
      expect(readResponse.body.data.city).toBe(testCity);
      expect(readResponse.body.data.temperature).toBe(newWeatherData.temperature);
      expect(readResponse.body.data.humidity).toBe(newWeatherData.humidity);

      // 3. UPDATE: Modify the weather data
      const updatedWeatherData = {
        city: testCity,
        temperature: 28.0,
        humidity: 48,
        pressure: 1019.5,
        description: 'Hot and sunny',
        wind_speed: 12.3,
        visibility: 22.0
      };

      const updateResponse = await request(app)
        .put(`/api/weather/${createdId}`)
        .send(updatedWeatherData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);
      expect(updateResponse.body.data.temperature).toBe(updatedWeatherData.temperature);

      // 4. READ AGAIN: Verify update worked
      const readUpdatedResponse = await request(app)
        .get(`/api/weather/${testCity}`);

      expect(readUpdatedResponse.status).toBe(200);
      expect(readUpdatedResponse.body.data.temperature).toBe(updatedWeatherData.temperature);
      expect(readUpdatedResponse.body.data.description).toBe(updatedWeatherData.description);

      // 5. DELETE: Remove the weather data
      const deleteResponse = await request(app)
        .delete(`/api/weather/${createdId}`);

      expect(deleteResponse.status).toBe(200);
      expect(deleteResponse.body.success).toBe(true);

      // 6. VERIFY DELETION: Confirm data is gone
      const readDeletedResponse = await request(app)
        .get(`/api/weather/${testCity}`);

      expect(readDeletedResponse.status).toBe(404);
      expect(readDeletedResponse.body.success).toBe(false);
    });

    test('should handle multiple concurrent operations', async () => {
      const testCities = [
        'Integration Test City A',
        'Integration Test City B',
        'Integration Test City C'
      ];

      // Create multiple weather records concurrently
      const createPromises = testCities.map((city, index) => {
        return request(app)
          .post('/api/weather')
          .send({
            city: city,
            temperature: 20 + index,
            humidity: 50 + index,
            pressure: 1013 + index,
            description: `Weather ${index}`,
            wind_speed: 10 + index,
            visibility: 15 + index
          });
      });

      const createResponses = await Promise.all(createPromises);
      
      // Verify all were created successfully
      createResponses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data.city).toBe(testCities[index]);
      });

      // Read all weather data and verify our test cities are included
      const allWeatherResponse = await request(app).get('/api/weather');
      expect(allWeatherResponse.status).toBe(200);
      
      const allCities = allWeatherResponse.body.data.map(item => item.city);
      testCities.forEach(city => {
        expect(allCities).toContain(city);
      });

      // Clean up: Delete all test cities
      const createdIds = createResponses.map(response => response.body.data.id);
      const deletePromises = createdIds.map(id => 
        request(app).delete(`/api/weather/${id}`)
      );

      const deleteResponses = await Promise.all(deletePromises);
      deleteResponses.forEach(response => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });
  });

  describe('Database Constraint and Transaction Tests', () => {
    test('should enforce unique city constraint across API operations', async () => {
      const duplicateCityData = {
        city: 'Berlin', // Already exists in sample data
        temperature: 16.0,
        humidity: 80,
        pressure: 1005.0,
        description: 'Different weather',
        wind_speed: 18.0,
        visibility: 7.0
      };

      const response = await request(app)
        .post('/api/weather')
        .send(duplicateCityData);

      expect(response.status).toBe(409);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already exists');
    });

    test('should maintain data integrity during updates', async () => {
      // Create test record
      const testData = {
        city: 'Integration Test Update City',
        temperature: 22.0,
        humidity: 65,
        pressure: 1014.0,
        description: 'Original',
        wind_speed: 9.0,
        visibility: 16.0
      };

      const createResponse = await request(app)
        .post('/api/weather')
        .send(testData);

      const createdId = createResponse.body.data.id;

      // Attempt to update with another existing city name (should work as long as it's not the exact same)
      const updateData = {
        city: 'Integration Test Update City Modified',
        temperature: 25.0,
        humidity: 60,
        pressure: 1016.0,
        description: 'Updated',
        wind_speed: 11.0,
        visibility: 18.0
      };

      const updateResponse = await request(app)
        .put(`/api/weather/${createdId}`)
        .send(updateData);

      expect(updateResponse.status).toBe(200);
      expect(updateResponse.body.success).toBe(true);

      // Verify the update persisted
      const readResponse = await request(app)
        .get('/api/weather/Integration Test Update City Modified');

      expect(readResponse.status).toBe(200);
      expect(readResponse.body.data.temperature).toBe(25.0);
      expect(readResponse.body.data.description).toBe('Updated');

      // Clean up
      await request(app).delete(`/api/weather/${createdId}`);
    });
  });

  describe('Search and Query Integration', () => {
    test('should perform case-insensitive search across database', async () => {
      // Test search for cities containing "ma" (should find Madrid)
      const searchResponse = await request(app)
        .get('/api/weather/search/ma');

      expect(searchResponse.status).toBe(200);
      expect(searchResponse.body.success).toBe(true);
      expect(searchResponse.body.count).toBeGreaterThan(0);
      
      const foundMadrid = searchResponse.body.data.find(item => 
        item.city.toLowerCase().includes('madrid')
      );
      expect(foundMadrid).toBeDefined();
    });

    test('should return consistent results for different query formats', async () => {
      // Create test data
      const testCity = 'Integration Test Search City';
      const testData = {
        city: testCity,
        temperature: 21.0,
        humidity: 58,
        pressure: 1012.5,
        description: 'Searchable',
        wind_speed: 7.5,
        visibility: 14.0
      };

      const createResponse = await request(app)
        .post('/api/weather')
        .send(testData);

      const createdId = createResponse.body.data.id;

      // Test different search approaches
      const searchByExactName = await request(app)
        .get(`/api/weather/${testCity}`);

      const searchByPartialName = await request(app)
        .get('/api/weather/search/Integration Test Search');

      const searchByGetAll = await request(app)
        .get('/api/weather');

      // All should return consistent data for our test city
      expect(searchByExactName.status).toBe(200);
      expect(searchByPartialName.status).toBe(200);
      expect(searchByGetAll.status).toBe(200);

      expect(searchByExactName.body.data.city).toBe(testCity);
      expect(searchByPartialName.body.data.find(item => item.city === testCity)).toBeDefined();
      expect(searchByGetAll.body.data.find(item => item.city === testCity)).toBeDefined();

      // Clean up
      await request(app).delete(`/api/weather/${createdId}`);
    });
  });

  describe('Error Handling and Recovery', () => {
    test('should handle database errors gracefully', async () => {
      // Try to access a record with an invalid ID format
      const response = await request(app)
        .get('/api/weather/search/');

      // Should handle gracefully (may return 404 or empty results)
      expect([200, 404]).toContain(response.status);
    });

    test('should maintain database consistency after failed operations', async () => {
      // Get initial count
      const initialResponse = await request(app).get('/api/weather');
      const initialCount = initialResponse.body.count;

      // Attempt invalid operation (missing required fields)
      const invalidResponse = await request(app)
        .post('/api/weather')
        .send({
          city: 'Invalid City'
          // Missing all other required fields
        });

      expect(invalidResponse.status).toBe(400);

      // Verify count hasn't changed
      const afterResponse = await request(app).get('/api/weather');
      expect(afterResponse.body.count).toBe(initialCount);
    });
  });

  describe('Database Performance and Scalability', () => {
    test('should handle batch operations efficiently', async () => {
      const startTime = Date.now();
      const batchSize = 10;
      
      // Create batch of weather records
      const createPromises = Array.from({ length: batchSize }, (_, index) => {
        return request(app)
          .post('/api/weather')
          .send({
            city: `Integration Batch Test City ${index}`,
            temperature: 20 + (index % 10),
            humidity: 50 + (index % 20),
            pressure: 1013 + (index % 5),
            description: `Batch test ${index}`,
            wind_speed: 10 + (index % 8),
            visibility: 15 + (index % 10)
          });
      });

      const createResponses = await Promise.all(createPromises);
      const createTime = Date.now() - startTime;

      // Verify all were created successfully
      createResponses.forEach((response, index) => {
        expect(response.status).toBe(201);
        expect(response.body.success).toBe(true);
      });

      // Performance check (should complete within reasonable time)
      expect(createTime).toBeLessThan(5000); // 5 seconds for 10 operations

      // Clean up batch
      const createdIds = createResponses.map(response => response.body.data.id);
      const deletePromises = createdIds.map(id => 
        request(app).delete(`/api/weather/${id}`)
      );

      await Promise.all(deletePromises);
    });
  });
}); 