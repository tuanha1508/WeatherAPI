import { WeatherData } from '@/types/weather'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Thermometer, Droplets, Gauge, Wind, Eye } from 'lucide-react'

interface WeatherCardProps {
  weather: WeatherData
  onEdit: () => void
  onDelete: () => void
}

export default function WeatherCard({ weather, onEdit, onDelete }: WeatherCardProps) {
  return (
    <Card className="w-full max-w-md transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌍 {weather.city}
        </CardTitle>
        <CardDescription>
          <Badge variant="secondary">{weather.description}</Badge>
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="font-semibold">{weather.temperature}°C</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-semibold">{weather.humidity}%</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Gauge className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pressure</p>
              <p className="font-semibold">{weather.pressure} hPa</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
            <Wind className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="font-semibold">{weather.wind_speed} km/h</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
          <Eye className="h-4 w-4 text-gray-500" />
          <div>
            <p className="text-sm text-muted-foreground">Visibility</p>
            <p className="font-semibold">{weather.visibility} km</p>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onEdit}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={onDelete}
            className="flex-1"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>

        <div className="text-xs text-muted-foreground pt-2 border-t">
          <p>Updated: {new Date(weather.updated_at).toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  )
} 