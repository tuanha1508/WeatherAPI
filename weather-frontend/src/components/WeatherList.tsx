'use client'

import { useState, useMemo } from 'react'
import { WeatherData } from '@/types/weather'
import { apiClient, handleApiError } from '@/lib/api'
import WeatherCard from './WeatherCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { RefreshCw, Search, Loader2 } from 'lucide-react'

interface WeatherListProps {
  weatherData: WeatherData[]
  loading: boolean
  onRefresh: () => void
  onDelete: () => void
  onEdit: (id: number) => void
}

export default function WeatherList({
  weatherData,
  loading,
  onRefresh,
  onDelete,
  onEdit
}: WeatherListProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; city: string } | null>(null)

  // Filter weather data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return weatherData
    
    return weatherData.filter((weather) =>
      weather.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      weather.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [weatherData, searchQuery])

  const handleDelete = async (id: number, city: string) => {
    try {
      await apiClient.deleteWeather(id)
      onDelete()
      setDeleteTarget(null)
    } catch (error) {
      alert(`Error deleting weather data: ${handleApiError(error)}`)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-lg text-muted-foreground">Loading weather data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Refresh Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search cities or weather conditions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Button onClick={onRefresh} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Data
        </Button>
      </div>

      {/* Weather Cards */}
      {filteredData.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">
            {searchQuery ? 'No weather data found matching your search.' : 'No weather data available.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredData.map((weather) => (
            <WeatherCard
              key={weather.id}
              weather={weather}
              onEdit={() => onEdit(weather.id)}
              onDelete={() => setDeleteTarget({ id: weather.id, city: weather.city })}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the weather data for{' '}
              <strong>{deleteTarget?.city}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && handleDelete(deleteTarget.id, deleteTarget.city)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 