const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize SQLite database
const db = new sqlite3.Database('./weather.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        initializeDatabase();
    }
});

// Initialize database schema
function initializeDatabase() {
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
        if (err) {
            console.error('Error creating table:', err.message);
        } else {
            console.log('Weather data table created successfully.');
            insertSampleData();
        }
    });
}

// Insert sample weather data
function insertSampleData() {
    const sampleData = [
        ['New York', 22.5, 65, 1013.25, 'Partly cloudy', 15.2, 10.0],
        ['London', 18.3, 72, 1008.5, 'Light rain', 12.8, 8.5],
        ['Tokyo', 28.7, 58, 1015.8, 'Sunny', 8.4, 15.0],
        ['Sydney', 25.1, 70, 1012.3, 'Overcast', 18.6, 12.0],
        ['Paris', 19.8, 68, 1010.2, 'Foggy', 10.3, 6.0]
    ];

    const insertQuery = `
        INSERT OR IGNORE INTO weather_data 
        (city, temperature, humidity, pressure, description, wind_speed, visibility) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    sampleData.forEach(data => {
        db.run(insertQuery, data, (err) => {
            if (err) {
                console.error('Error inserting sample data:', err.message);
            }
        });
    });
    
    console.log('Sample weather data inserted.');
}

// API Routes

// 1. GET /api/weather - Get all weather data
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

// 2. GET /api/weather/:city - Get weather for a specific city
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

// 3. POST /api/weather - Add new weather data
app.post('/api/weather', (req, res) => {
    const { city, temperature, humidity, pressure, description, wind_speed, visibility } = req.body;
    
    // Validation
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

// 4. PUT /api/weather/:id - Update weather data by ID
app.put('/api/weather/:id', (req, res) => {
    const id = req.params.id;
    const { city, temperature, humidity, pressure, description, wind_speed, visibility } = req.body;
    
    // Validation
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

// 5. DELETE /api/weather/:id - Delete weather data by ID
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

// 6. GET /api/weather/search/:query - Search weather data by city name (bonus endpoint)
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

// Root endpoint - API info
app.get('/', (req, res) => {
    res.json({
        message: 'Weather API Server',
        version: '1.0.0',
        endpoints: {
            'GET /api/weather': 'Get all weather data',
            'GET /api/weather/:id': 'Get weather data by ID',
            'POST /api/weather': 'Add new weather data',
            'PUT /api/weather/:id': 'Update weather data by ID',
            'DELETE /api/weather/:id': 'Delete weather data by ID',
            'GET /api/weather/search/:query': 'Search weather data by city name'
        },
        frontend: 'Next.js frontend available in weather-frontend directory'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: err.message
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

// Close database connection on app termination
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Weather API server running on http://localhost:${PORT}`);
    console.log(`API documentation: http://localhost:${PORT}/api/weather`);
    console.log(`Next.js frontend: cd weather-frontend && npm run dev (runs on port 3001)`);
}); 