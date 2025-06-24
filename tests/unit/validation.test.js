describe('Weather Data Validation Unit Tests', () => {
  
  // Validation utility functions (extracted from server logic)
  const validateWeatherData = (data) => {
    const requiredFields = ['city', 'temperature', 'humidity', 'pressure', 'description', 'wind_speed', 'visibility'];
    return requiredFields.every(field => data[field] !== undefined && data[field] !== null);
  };

  const validateDataTypes = (data) => {
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

  const validateRanges = (data) => {
    return (
      data.humidity >= 0 && data.humidity <= 100 &&
      data.pressure > 0 &&
      data.wind_speed >= 0 &&
      data.visibility >= 0 &&
      data.temperature >= -100 && data.temperature <= 100 // Reasonable temperature range
    );
  };

  const sanitizeCity = (city) => {
    if (typeof city !== 'string') return '';
    return city.trim().replace(/[<>]/g, ''); // Basic XSS prevention
  };

  const formatTemperature = (temp) => {
    return Math.round(temp * 10) / 10; // Round to 1 decimal place
  };

  describe('Required Fields Validation', () => {
    test('should return true for complete weather data', () => {
      const validData = {
        city: 'Test City',
        temperature: 25.5,
        humidity: 60,
        pressure: 1013.25,
        description: 'Sunny',
        wind_speed: 10.5,
        visibility: 15.0
      };

      expect(validateWeatherData(validData)).toBe(true);
    });

    test('should return false for missing required fields', () => {
      const requiredFields = ['city', 'temperature', 'humidity', 'pressure', 'description', 'wind_speed', 'visibility'];
      
      requiredFields.forEach(field => {
        const incompleteData = {
          city: 'Test City',
          temperature: 25.5,
          humidity: 60,
          pressure: 1013.25,
          description: 'Sunny',
          wind_speed: 10.5,
          visibility: 15.0
        };
        
        delete incompleteData[field];
        expect(validateWeatherData(incompleteData)).toBe(false);
      });
    });

    test('should return false for null or undefined values', () => {
      const dataWithNull = {
        city: 'Test City',
        temperature: null,
        humidity: 60,
        pressure: 1013.25,
        description: 'Sunny',
        wind_speed: 10.5,
        visibility: 15.0
      };

      const dataWithUndefined = {
        city: 'Test City',
        temperature: undefined,
        humidity: 60,
        pressure: 1013.25,
        description: 'Sunny',
        wind_speed: 10.5,
        visibility: 15.0
      };

      expect(validateWeatherData(dataWithNull)).toBe(false);
      expect(validateWeatherData(dataWithUndefined)).toBe(false);
    });
  });

  describe('Data Type Validation', () => {
    test('should return true for correct data types', () => {
      const validData = {
        city: 'Test City',
        temperature: 25.5,
        humidity: 60,
        pressure: 1013.25,
        description: 'Sunny',
        wind_speed: 10.5,
        visibility: 15.0
      };

      expect(validateDataTypes(validData)).toBe(true);
    });

    test('should return false for incorrect data types', () => {
      const testCases = [
        { city: 123, field: 'city', expectedType: 'string' },
        { temperature: '25.5', field: 'temperature', expectedType: 'number' },
        { humidity: '60', field: 'humidity', expectedType: 'number' },
        { pressure: '1013.25', field: 'pressure', expectedType: 'number' },
        { description: 123, field: 'description', expectedType: 'string' },
        { wind_speed: '10.5', field: 'wind_speed', expectedType: 'number' },
        { visibility: '15.0', field: 'visibility', expectedType: 'number' }
      ];

      testCases.forEach(({ field, expectedType, ...wrongValue }) => {
        const invalidData = {
          city: 'Test City',
          temperature: 25.5,
          humidity: 60,
          pressure: 1013.25,
          description: 'Sunny',
          wind_speed: 10.5,
          visibility: 15.0,
          ...wrongValue
        };

        expect(validateDataTypes(invalidData)).toBe(false);
      });
    });

    test('should handle edge cases for numeric types', () => {
      const edgeCases = [
        { temperature: 0, humidity: 0, pressure: 0.1, wind_speed: 0, visibility: 0 }, // Zero values
        { temperature: -50.5, humidity: 100, pressure: 1050.0, wind_speed: 50.0, visibility: 100.0 }, // Extreme values
        { temperature: 0.1, humidity: 0.5, pressure: 999.99, wind_speed: 0.01, visibility: 0.1 } // Decimal values
      ];

      edgeCases.forEach(edgeCase => {
        const testData = {
          city: 'Edge Case City',
          description: 'Edge case weather',
          ...edgeCase
        };

        expect(validateDataTypes(testData)).toBe(true);
      });
    });
  });

  describe('Value Range Validation', () => {
    test('should return true for values within valid ranges', () => {
      const validRangeData = {
        temperature: 22.5,
        humidity: 65,
        pressure: 1013.25,
        wind_speed: 15.2,
        visibility: 10.0
      };

      expect(validateRanges(validRangeData)).toBe(true);
    });

    test('should return false for humidity outside 0-100 range', () => {
      const invalidHumidityData = [
        { humidity: -1 },
        { humidity: 101 },
        { humidity: -50 },
        { humidity: 150 }
      ];

      invalidHumidityData.forEach(humidityCase => {
        const testData = {
          temperature: 22.5,
          humidity: 65,
          pressure: 1013.25,
          wind_speed: 15.2,
          visibility: 10.0,
          ...humidityCase
        };

        expect(validateRanges(testData)).toBe(false);
      });
    });

    test('should return false for negative pressure', () => {
      const invalidPressureData = {
        temperature: 22.5,
        humidity: 65,
        pressure: -1013.25,
        wind_speed: 15.2,
        visibility: 10.0
      };

      expect(validateRanges(invalidPressureData)).toBe(false);
    });

    test('should return false for negative wind speed or visibility', () => {
      const negativeWindSpeed = {
        temperature: 22.5,
        humidity: 65,
        pressure: 1013.25,
        wind_speed: -15.2,
        visibility: 10.0
      };

      const negativeVisibility = {
        temperature: 22.5,
        humidity: 65,
        pressure: 1013.25,
        wind_speed: 15.2,
        visibility: -10.0
      };

      expect(validateRanges(negativeWindSpeed)).toBe(false);
      expect(validateRanges(negativeVisibility)).toBe(false);
    });

    test('should return false for extreme temperatures', () => {
      const extremeTemperatures = [
        { temperature: -150 },
        { temperature: 150 },
        { temperature: 1000 },
        { temperature: -1000 }
      ];

      extremeTemperatures.forEach(tempCase => {
        const testData = {
          temperature: 22.5,
          humidity: 65,
          pressure: 1013.25,
          wind_speed: 15.2,
          visibility: 10.0,
          ...tempCase
        };

        expect(validateRanges(testData)).toBe(false);
      });
    });

    test('should accept boundary values', () => {
      const boundaryValues = [
        { humidity: 0 },
        { humidity: 100 },
        { temperature: -100 },
        { temperature: 100 },
        { wind_speed: 0 },
        { visibility: 0 }
      ];

      boundaryValues.forEach(boundaryCase => {
        const testData = {
          temperature: 22.5,
          humidity: 65,
          pressure: 1013.25,
          wind_speed: 15.2,
          visibility: 10.0,
          ...boundaryCase
        };

        expect(validateRanges(testData)).toBe(true);
      });
    });
  });

  describe('Data Sanitization', () => {
    test('should trim whitespace from city names', () => {
      expect(sanitizeCity('  New York  ')).toBe('New York');
      expect(sanitizeCity('\tLondon\n')).toBe('London');
      expect(sanitizeCity(' Paris ')).toBe('Paris');
    });

    test('should remove HTML tags for basic XSS prevention', () => {
      expect(sanitizeCity('<script>alert("xss")</script>London')).toBe('scriptalert("xss")/scriptLondon');
      expect(sanitizeCity('New<>York')).toBe('NewYork');
      expect(sanitizeCity('<div>Paris</div>')).toBe('divParis/div');
    });

    test('should handle non-string inputs', () => {
      expect(sanitizeCity(null)).toBe('');
      expect(sanitizeCity(undefined)).toBe('');
      expect(sanitizeCity(123)).toBe('');
      expect(sanitizeCity({})).toBe('');
    });

    test('should preserve valid city names', () => {
      const validCities = [
        'New York',
        'Los Angeles',
        'São Paulo',
        'Tokyo',
        'London',
        "St. John's",
        'Mexico City'
      ];

      validCities.forEach(city => {
        expect(sanitizeCity(city)).toBe(city);
      });
    });
  });

  describe('Data Formatting', () => {
    test('should format temperature to 1 decimal place', () => {
      expect(formatTemperature(25.666666)).toBe(25.7);
      expect(formatTemperature(25.123456)).toBe(25.1);
      expect(formatTemperature(25.05)).toBe(25.1);
      expect(formatTemperature(25.04)).toBe(25.0);
    });

    test('should handle integer temperatures', () => {
      expect(formatTemperature(25)).toBe(25.0);
      expect(formatTemperature(0)).toBe(0.0);
      expect(formatTemperature(-5)).toBe(-5.0);
    });

    test('should handle edge case numbers', () => {
      expect(formatTemperature(0.0)).toBe(0.0);
      expect(formatTemperature(-0.0)).toBe(-0.0);
      expect(formatTemperature(0.05)).toBe(0.1);
      expect(formatTemperature(-0.05)).toBe(-0.0);
    });
  });

  describe('Combined Validation Workflow', () => {
    test('should validate complete weather object through all checks', () => {
      const completeWeatherData = {
        city: '  Valid City  ',
        temperature: 25.666,
        humidity: 65,
        pressure: 1013.25,
        description: 'Partly cloudy',
        wind_speed: 12.5,
        visibility: 15.0
      };

      // Step 1: Check required fields
      expect(validateWeatherData(completeWeatherData)).toBe(true);

      // Step 2: Check data types
      expect(validateDataTypes(completeWeatherData)).toBe(true);

      // Step 3: Check ranges
      expect(validateRanges(completeWeatherData)).toBe(true);

      // Step 4: Sanitize and format
      const sanitizedCity = sanitizeCity(completeWeatherData.city);
      const formattedTemp = formatTemperature(completeWeatherData.temperature);

      expect(sanitizedCity).toBe('Valid City');
      expect(formattedTemp).toBe(25.7);
    });

    test('should fail validation at appropriate step for invalid data', () => {
      const invalidDataSets = [
        {
          name: 'Missing required field',
          data: { city: 'Test', temperature: 25 }, // Missing other fields
          shouldFailAt: 'required'
        },
        {
          name: 'Wrong data type',
          data: {
            city: 'Test',
            temperature: '25',
            humidity: 60,
            pressure: 1013,
            description: 'Sunny',
            wind_speed: 10,
            visibility: 15
          },
          shouldFailAt: 'types'
        },
        {
          name: 'Out of range value',
          data: {
            city: 'Test',
            temperature: 25,
            humidity: 150, // Invalid
            pressure: 1013,
            description: 'Sunny',
            wind_speed: 10,
            visibility: 15
          },
          shouldFailAt: 'ranges'
        }
      ];

      invalidDataSets.forEach(({ name, data, shouldFailAt }) => {
        const hasRequiredFields = validateWeatherData(data);
        const hasValidTypes = hasRequiredFields ? validateDataTypes(data) : false;
        const hasValidRanges = hasValidTypes ? validateRanges(data) : false;

        switch (shouldFailAt) {
          case 'required':
            expect(hasRequiredFields).toBe(false);
            break;
          case 'types':
            expect(hasRequiredFields).toBe(true);
            expect(hasValidTypes).toBe(false);
            break;
          case 'ranges':
            expect(hasRequiredFields).toBe(true);
            expect(hasValidTypes).toBe(true);
            expect(hasValidRanges).toBe(false);
            break;
        }
      });
    });
  });

  describe('Error Message Generation', () => {
    const generateValidationError = (data) => {
      if (!validateWeatherData(data)) {
        return 'All fields are required: city, temperature, humidity, pressure, description, wind_speed, visibility';
      }
      if (!validateDataTypes(data)) {
        return 'Invalid data types provided';
      }
      if (!validateRanges(data)) {
        return 'Values are outside acceptable ranges';
      }
      return null;
    };

    test('should generate appropriate error messages', () => {
      const missingFieldData = { city: 'Test' };
      const wrongTypeData = {
        city: 'Test',
        temperature: '25',
        humidity: 60,
        pressure: 1013,
        description: 'Sunny',
        wind_speed: 10,
        visibility: 15
      };
      const outOfRangeData = {
        city: 'Test',
        temperature: 25,
        humidity: 150,
        pressure: 1013,
        description: 'Sunny',
        wind_speed: 10,
        visibility: 15
      };
      const validData = {
        city: 'Test',
        temperature: 25,
        humidity: 60,
        pressure: 1013,
        description: 'Sunny',
        wind_speed: 10,
        visibility: 15
      };

      expect(generateValidationError(missingFieldData)).toContain('All fields are required');
      expect(generateValidationError(wrongTypeData)).toBe('Invalid data types provided');
      expect(generateValidationError(outOfRangeData)).toBe('Values are outside acceptable ranges');
      expect(generateValidationError(validData)).toBeNull();
    });
  });
});