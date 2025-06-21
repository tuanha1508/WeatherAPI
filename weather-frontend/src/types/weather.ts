export interface WeatherData {
  id: number
  city: string
  temperature: number
  humidity: number
  pressure: number
  description: string
  wind_speed: number
  visibility: number
  created_at: string
  updated_at: string
}

export interface WeatherResponse {
  success: boolean
  data: WeatherData[]
  count?: number
  message?: string
}

export interface SingleWeatherResponse {
  success: boolean
  data: WeatherData
  message?: string
}

export interface WeatherSearchResponse {
  success: boolean
  data: WeatherData[]
  count: number
  query: string
}

export interface CreateWeatherData {
  city: string
  temperature: number
  humidity: number
  pressure: number
  description: string
  wind_speed: number
  visibility: number
}

export interface ApiError {
  success: false
  message: string
} 