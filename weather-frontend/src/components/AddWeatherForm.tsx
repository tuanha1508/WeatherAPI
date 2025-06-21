'use client'

import { useState } from 'react'
import { CreateWeatherData } from '@/types/weather'
import { apiClient, handleApiError } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Loader2 } from 'lucide-react'

interface AddWeatherFormProps {
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

export default function AddWeatherForm({ onSuccess }: AddWeatherFormProps) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await apiClient.createWeather(formData)
      onSuccess()
      
      // Reset form
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

  const handleInputChange = (name: keyof CreateWeatherData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Weather Data
        </CardTitle>
        <CardDescription>
          Enter weather information for a city
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="bg-destructive/15 border border-destructive text-destructive px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="city">City Name</Label>
            <Input
              id="city"
              type="text"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Enter city name"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="temperature">Temperature (°C)</Label>
              <Input
                id="temperature"
                type="number"
                step="0.1"
                value={formData.temperature}
                onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="humidity">Humidity (%)</Label>
              <Input
                id="humidity"
                type="number"
                min="0"
                max="100"
                value={formData.humidity}
                onChange={(e) => handleInputChange('humidity', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="pressure">Pressure (hPa)</Label>
              <Input
                id="pressure"
                type="number"
                step="0.01"
                value={formData.pressure}
                onChange={(e) => handleInputChange('pressure', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="wind_speed">Wind Speed (km/h)</Label>
              <Input
                id="wind_speed"
                type="number"
                step="0.1"
                value={formData.wind_speed}
                onChange={(e) => handleInputChange('wind_speed', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility (km)</Label>
              <Input
                id="visibility"
                type="number"
                step="0.1"
                value={formData.visibility}
                onChange={(e) => handleInputChange('visibility', parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Weather Description</Label>
              <Select 
                value={formData.description} 
                onValueChange={(value) => handleInputChange('description', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select weather condition" />
                </SelectTrigger>
                <SelectContent>
                  {weatherDescriptions.map((desc) => (
                    <SelectItem key={desc} value={desc}>
                      {desc}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Weather Data...
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                Add Weather Data
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
} 