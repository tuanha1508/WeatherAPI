'use client'

import WeatherDashboard from '@/components/WeatherDashboard'
import { Cloud } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Weather API Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Manage weather data with our comprehensive API interface built with TypeScript, Tailwind CSS, and shadcn/ui
          </p>
        </div>
        
        <WeatherDashboard />
      </div>
    </div>
  )
}
