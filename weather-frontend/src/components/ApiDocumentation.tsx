export default function ApiDocumentation() {
  const endpoints = [
    {
      method: 'GET',
      path: '/api/weather',
      description: 'Retrieve all weather data',
      response: `{
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
}`,
    },
    {
      method: 'GET',
      path: '/api/weather/:city',
      description: 'Get weather data for a specific city',
      parameters: 'city (string) - City name',
      example: '/api/weather/London',
      response: `{
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
}`,
    },
    {
      method: 'POST',
      path: '/api/weather',
      description: 'Add new weather data',
      body: `{
  "city": "Barcelona",
  "temperature": 24.5,
  "humidity": 65,
  "pressure": 1015.2,
  "description": "Sunny",
  "wind_speed": 12.3,
  "visibility": 15.0
}`,
      response: `{
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
}`,
    },
    {
      method: 'PUT',
      path: '/api/weather/:id',
      description: 'Update weather data by ID',
      parameters: 'id (integer) - Weather record ID',
      example: '/api/weather/1',
      body: 'Same as POST request',
      response: `{
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
}`,
    },
    {
      method: 'DELETE',
      path: '/api/weather/:id',
      description: 'Delete weather data by ID',
      parameters: 'id (integer) - Weather record ID',
      example: '/api/weather/1',
      response: `{
  "success": true,
  "message": "Weather data with ID 1 deleted successfully"
}`,
    },
    {
      method: 'GET',
      path: '/api/weather/search/:query',
      description: 'Search weather data by city name (partial matching)',
      parameters: 'query (string) - Search term',
      example: '/api/weather/search/lon (finds "London")',
      response: `{
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
}`,
    },
  ]

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET':
        return 'bg-green-100 text-green-800'
      case 'POST':
        return 'bg-blue-100 text-blue-800'
      case 'PUT':
        return 'bg-yellow-100 text-yellow-800'
      case 'DELETE':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">API Documentation</h2>
      
      <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-xl font-semibold text-blue-800 mb-3">Base URL</h3>
        <code className="text-blue-700 bg-blue-100 px-3 py-1 rounded">
          http://localhost:3000
        </code>
        <p className="text-blue-700 mt-2">
          All API endpoints require JSON content type for POST/PUT requests.
        </p>
      </div>

      <div className="space-y-8">
        {endpoints.map((endpoint, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getMethodColor(
                  endpoint.method
                )}`}
              >
                {endpoint.method}
              </span>
              <code className="text-lg font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded">
                {endpoint.path}
              </code>
            </div>

            <p className="text-gray-700 mb-4">{endpoint.description}</p>

            {endpoint.parameters && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Parameters:</h4>
                <p className="text-gray-600">{endpoint.parameters}</p>
              </div>
            )}

            {endpoint.example && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Example:</h4>
                <code className="text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {endpoint.example}
                </code>
              </div>
            )}

            {endpoint.body && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Request Body:</h4>
                <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm">
                  <code>{endpoint.body}</code>
                </pre>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Response:</h4>
              <pre className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{endpoint.response}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">Additional Endpoints</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                GET
              </span>
              <code className="font-mono text-gray-800 bg-gray-100 px-3 py-1 rounded">
                /health
              </code>
            </div>
            <p className="text-gray-700 mb-2">Server health check endpoint</p>
            <pre className="bg-white border border-gray-200 rounded p-3 text-sm">
              <code>{`{
  "status": "OK",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "uptime": 3600
}`}</code>
            </pre>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-xl font-semibold text-yellow-800 mb-3">Error Responses</h3>
        <p className="text-yellow-700 mb-3">
          All errors return a consistent JSON format:
        </p>
        <pre className="bg-white border border-yellow-200 rounded p-3 text-sm">
          <code>{`{
  "success": false,
  "message": "Error description"
}`}</code>
        </pre>
        <div className="mt-4 space-y-2 text-sm text-yellow-700">
          <p><strong>400 Bad Request:</strong> Invalid input data or missing required fields</p>
          <p><strong>404 Not Found:</strong> Resource not found (city or weather ID)</p>
          <p><strong>409 Conflict:</strong> Attempting to create duplicate city data</p>
          <p><strong>500 Internal Server Error:</strong> Database or server errors</p>
        </div>
      </div>
    </div>
  )
} 