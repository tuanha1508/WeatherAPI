'use client'

import { useState, useEffect } from 'react'
import { WeatherData } from '@/types/weather'
import { apiClient, handleApiError } from '@/lib/api'
import WeatherList from './WeatherList'
import AddWeatherForm from './AddWeatherForm'
import UpdateWeatherForm from './UpdateWeatherForm'
import ApiDocumentation from './ApiDocumentation'
import Alert from './Alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Plus, Edit, BookOpen } from 'lucide-react'

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showAlert = (message: string, type: 'success' | 'error') => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  const loadWeatherData = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAllWeather()
      if (response.success) {
        setWeatherData(response.data)
      } else {
        showAlert('Failed to load weather data', 'error')
      }
    } catch (error) {
      showAlert(handleApiError(error), 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleWeatherAdded = () => {
    loadWeatherData()
    showAlert('Weather data added successfully!', 'success')
  }

  const handleWeatherUpdated = () => {
    loadWeatherData()
    showAlert('Weather data updated successfully!', 'success')
  }

  const handleWeatherDeleted = () => {
    loadWeatherData()
    showAlert('Weather data deleted successfully!', 'success')
  }

  useEffect(() => {
    loadWeatherData()
  }, [])

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}

      <Tabs defaultValue="view" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="view" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            View Weather
          </TabsTrigger>
          <TabsTrigger value="add" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Weather
          </TabsTrigger>
          <TabsTrigger value="update" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Update Weather
          </TabsTrigger>
          <TabsTrigger value="docs" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            API Docs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="mt-6">
          <WeatherList
            weatherData={weatherData}
            loading={loading}
            onRefresh={loadWeatherData}
            onDelete={handleWeatherDeleted}
            onEdit={(id) => {
              // Switch to update tab when edit is clicked
              const tabsElement = document.querySelector('[data-state="inactive"][value="update"]') as HTMLButtonElement;
              tabsElement?.click();
            }}
          />
        </TabsContent>

        <TabsContent value="add" className="mt-6">
          <AddWeatherForm onSuccess={handleWeatherAdded} />
        </TabsContent>

        <TabsContent value="update" className="mt-6">
          <UpdateWeatherForm
            weatherData={weatherData}
            onSuccess={handleWeatherUpdated}
          />
        </TabsContent>

        <TabsContent value="docs" className="mt-6">
          <ApiDocumentation />
        </TabsContent>
      </Tabs>
    </div>
  )
} 