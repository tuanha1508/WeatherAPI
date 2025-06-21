import {
  WeatherResponse,
  SingleWeatherResponse,
  WeatherSearchResponse,
  CreateWeatherData,
  WeatherData,
  ApiError
} from '@/types/weather'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class ApiClient {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Get all weather data
  async getAllWeather(): Promise<WeatherResponse> {
    return this.request<WeatherResponse>('/api/weather')
  }

  // Get weather data by city
  async getWeatherByCity(city: string): Promise<SingleWeatherResponse> {
    return this.request<SingleWeatherResponse>(`/api/weather/${encodeURIComponent(city)}`)
  }

  // Search weather data
  async searchWeather(query: string): Promise<WeatherSearchResponse> {
    return this.request<WeatherSearchResponse>(`/api/weather/search/${encodeURIComponent(query)}`)
  }

  // Create new weather data
  async createWeather(data: CreateWeatherData): Promise<SingleWeatherResponse> {
    return this.request<SingleWeatherResponse>('/api/weather', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Update weather data
  async updateWeather(id: number, data: CreateWeatherData): Promise<SingleWeatherResponse> {
    return this.request<SingleWeatherResponse>(`/api/weather/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  // Delete weather data
  async deleteWeather(id: number): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>(`/api/weather/${id}`, {
      method: 'DELETE',
    })
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string; uptime: number }> {
    return this.request<{ status: string; timestamp: string; uptime: number }>('/health')
  }
}

export const apiClient = new ApiClient()

// Helper function to handle API errors
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return 'An unexpected error occurred'
} 