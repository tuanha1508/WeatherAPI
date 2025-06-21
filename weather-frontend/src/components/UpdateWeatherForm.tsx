'use client'

import { useState, useEffect } from 'react'
import { WeatherData, CreateWeatherData } from '@/types/weather'
import { apiClient, handleApiError } from '@/lib/api'

interface UpdateWeatherFormProps {
  weatherData: WeatherData[]
  onSuccess: () => void
}

const weatherDescriptions = [
  'Sunny',
  'Partly cloudy',
  'Cloudy',
  'Overcast',
  'Light rain',
  'Heavy rain',
  'Thunderstorm',
  'Snow',
  'Foggy',
  'Windy'
]

export default function UpdateWeatherForm({ weatherData, onSuccess }: UpdateWeatherFormProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [formData, setFormData] = useState<CreateWeatherData>({
    city: '',
    temperature: 0,
    humidity: 0,
    pressure: 0,
    description: '',
    wind_speed: 0,
    visibility: 0
  })
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = parseInt(e.target.value)
    setSelectedId(id)
    
    if (id) {
      const weather = weatherData.find(w => w.id === id)
      if (weather) {
        setFormData({
          city: weather.city,
          temperature: weather.temperature,
          humidity: weather.humidity,
          pressure: weather.pressure,
          description: weather.description,
          wind_speed: weather.wind_speed,
          visibility: weather.visibility
        })
      }
    } else {
      setFormData({
        city: '',
        temperature: 0,
        humidity: 0,
        pressure: 0,
        description: '',
        wind_speed: 0,
        visibility: 0
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedId) return
    
    setLoading(true)
    setError(null)

    try {
      await apiClient.updateWeather(selectedId, formData)
      onSuccess()
      setSelectedId(null)
      setFormData({
        city: '',
        temperature: 0,
        humidity: 0,
        pressure: 0,
        description: '',
        wind_speed: 0,
        visibility: 0
      })
    } catch (error) {
      setError(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: ['temperature', 'humidity', 'pressure', 'wind_speed', 'visibility'].includes(name)
        ? parseFloat(value) || 0
        : value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Update Weather Data</h2>
      
      <div className="mb-6">
        <label htmlFor="citySelect" className="block text-sm font-medium text-gray-700 mb-2">
          Select City to Update
        </label>
        <select
          id="citySelect"
          value={selectedId || ''}
          onChange={handleCitySelect}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Select a city...</option>
          {weatherData.map((weather) => (
            <option key={weather.id} value={weather.id}>
              {weather.city}
            </option>
          ))}
        </select>
      </div>

      {selectedId && (
        <>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                City Name
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter city name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="temperature" className="block text-sm font-medium text-gray-700 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  id="temperature"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleChange}
                  step="0.1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="humidity" className="block text-sm font-medium text-gray-700 mb-2">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  id="humidity"
                  name="humidity"
                  value={formData.humidity}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="pressure" className="block text-sm font-medium text-gray-700 mb-2">
                  Pressure (hPa)
                </label>
                <input
                  type="number"
                  id="pressure"
                  name="pressure"
                  value={formData.pressure}
                  onChange={handleChange}
                  step="0.01"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="wind_speed" className="block text-sm font-medium text-gray-700 mb-2">
                  Wind Speed (km/h)
                </label>
                <input
                  type="number"
                  id="wind_speed"
                  name="wind_speed"
                  value={formData.wind_speed}
                  onChange={handleChange}
                  step="0.1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 mb-2">
                  Visibility (km)
                </label>
                <input
                  type="number"
                  id="visibility"
                  name="visibility"
                  value={formData.visibility}
                  onChange={handleChange}
                  step="0.1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Weather Description
                </label>
                <select
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select weather condition</option>
                  {weatherDescriptions.map((desc) => (
                    <option key={desc} value={desc}>
                      {desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  '✏️ Update Weather Data'
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  )
} 