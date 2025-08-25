import { normalize } from '../constants/txt'
import type { Weather } from '../types'

type WeatherApiForecastResponse = {
  location: { name: string; country: string }
  current: {
    temp_c: number
    condition: { text: string; icon: string }
    wind_kph: number
  }
  forecast?: {
    forecastday: { day: { maxtemp_c: number; mintemp_c: number } }[]
  }
}

const API = 'https://api.weatherapi.com/v1/forecast.json'

const fetchCurrent = async (city: string): Promise<Weather> => {
  const key = (import.meta as any).env.VITE_WEATHER_API_KEY
  const query = normalize(city)
  if (!key) throw new Error('Missing VITE_WEATHER_API_KEY env variable see README.md')
  if (!query) throw new Error('Cant fetch weather for empty city')

  const url = `${API}?key=${key}&q=${encodeURIComponent(query)}&days=1&aqi=no&alerts=no`
  const res = await fetch(url)
  if (!res.ok) {
    let errorMessage = res.status.toString()
    try {
      const errorResponse = await res.json() as { error?: { message: string } }
      errorMessage = errorResponse?.error?.message || errorMessage
    } catch {}
    throw new Error(errorMessage)
  }
  const data = (await res.json()) as WeatherApiForecastResponse
  const day = data.forecast?.forecastday?.[0]?.day
  const min = day?.mintemp_c ?? data.current.temp_c
  const max = day?.maxtemp_c ?? data.current.temp_c

  return {
    city: data.location.name,
    country: data.location.country,
    temp: data.current.temp_c,
    minTemp: min,
    maxTemp: max,
    description: data.current.condition.text,
    windSpeed: data.current.wind_kph,
    iconUrl: normalizeIcon(data.current.condition.icon),
  }
}

const normalizeIcon = (icon?: string) => {
  if (!icon) return undefined
  return icon.startsWith('//') ? `https:${icon}` : icon
}

export { fetchCurrent, normalizeIcon }