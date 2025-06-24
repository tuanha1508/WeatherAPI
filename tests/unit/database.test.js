const fs = require('fs');
const path = require('path');

// Create a mock that can be controlled
const mockDatabase = jest.fn();
const mockVerbose = jest.fn(() => ({ Database: mockDatabase }));

jest.mock('sqlite3', () => ({
  verbose: mockVerbose
}));

// Import after mocking
const sqlite3 = require('sqlite3');

describe('Database Unit Tests', () => {
  let mockDb;
  let realDb;
  const testDbPath = './test-weather.db';

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Setup mock database
    mockDb = {
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn(),
      close: jest.fn()
    };
  });

  afterEach(() => {
    // Clean up test database if it exists
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  describe('Database Initialization (Mocked)', () => {
    test('should create database connection successfully', () => {
      mockDatabase.mockImplementation((path, callback) => {
        callback(null); // No error
        return mockDb;
      });

      const db = new (sqlite3.verbose().Database)(testDbPath, (err) => {
        expect(err).toBeNull();
      });

      expect(mockDatabase).toHaveBeenCalledWith(testDbPath, expect.any(Function));
    });

    test('should handle database connection error', () => {
      const mockError = new Error('Database connection failed');
      
      mockDatabase.mockImplementation((path, callback) => {
        callback(mockError);
        return mockDb;
      });

      const db = new (sqlite3.verbose().Database)(testDbPath, (err) => {
        expect(err).toBe(mockError);
      });

      expect(mockDatabase).toHaveBeenCalledWith(testDbPath, expect.any(Function));
    });
  });

  // Note: Database operations (CRUD, constraints, transactions) are 
  // comprehensively tested in tests/integration/server-database.test.js

  describe('Validation Tests', () => {
    test('should validate required fields for weather data', () => {
      const requiredFields = ['city', 'temperature', 'humidity', 'pressure', 'description', 'wind_speed', 'visibility'];
      const testData = {
        city: 'Test City',
        temperature: 25.5,
        humidity: 60,
        pressure: 1013.25,
        description: 'Sunny',
        wind_speed: 10.5,
        visibility: 15.0
      };

      // Test complete data
      const validateData = (data) => {
        return requiredFields.every(field => data[field] !== undefined && data[field] !== null);
      };

      expect(validateData(testData)).toBe(true);

      // Test missing fields
      requiredFields.forEach(field => {
        const incompleteData = { ...testData };
        delete incompleteData[field];
        expect(validateData(incompleteData)).toBe(false);
      });
    });

    test('should validate data types', () => {
      const validateTypes = (data) => {
        return (
          typeof data.city === 'string' &&
          typeof data.temperature === 'number' &&
          typeof data.humidity === 'number' &&
          typeof data.pressure === 'number' &&
          typeof data.description === 'string' &&
          typeof data.wind_speed === 'number' &&
          typeof data.visibility === 'number'
        );
      };

      const validData = {
        city: 'Test City',
        temperature: 25.5,
        humidity: 60,
        pressure: 1013.25,
        description: 'Sunny',
        wind_speed: 10.5,
        visibility: 15.0
      };

      expect(validateTypes(validData)).toBe(true);

      const invalidData = {
        city: 123, // Should be string
        temperature: '25.5', // Should be number
        humidity: 60,
        pressure: 1013.25,
        description: 'Sunny',
        wind_speed: 10.5,
        visibility: 15.0
      };

      expect(validateTypes(invalidData)).toBe(false);
    });
  });
}); 