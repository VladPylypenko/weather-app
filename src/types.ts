
export type Weather = {
  city: string
  country?: string
  temp: number
  minTemp: number
  maxTemp: number
  description: string
  windSpeed: number
  iconUrl?: string
}
export type WeatherStatus = 'idle' | 'loading' | 'succeeded' | 'failed'
