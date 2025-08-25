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

export async function fetchCurrent(city: string): Promise<Weather> {
  const key = (import.meta as any).env.VITE_WEATHER_API_KEY
  const q = normalize(city)
  if (!key) throw new Error('Missing VITE_WEATHER_API_KEY env variable see README.md')
  if (!q) throw new Error('Cant fetch weather for empty city')

  const url = `${API}?key=${key}&q=${encodeURIComponent(q)}&days=1&aqi=no&alerts=no`
  const res = await fetch(url)
  if (!res.ok) {
    let errorMessage = res.status.toString()
    try {
      const j = await res.json() as { error?: { message: string } }
      errorMessage = j?.error?.message || errorMessage
    } catch {}
    throw new Error(errorMessage)
  }
  const d = (await res.json()) as WeatherApiForecastResponse
  const day = d.forecast?.forecastday?.[0]?.day
  const min = day?.mintemp_c ?? d.current.temp_c
  const max = day?.maxtemp_c ?? d.current.temp_c

  return {
    city: d.location.name,
    country: d.location.country,
    temp: d.current.temp_c,
    minTemp: min,
    maxTemp: max,
    description: d.current.condition.text,
    windSpeed: d.current.wind_kph,
    iconUrl: normalizeIcon(d.current.condition.icon),
  }
}

function normalizeIcon(icon?: string) {
  if (!icon) return undefined
  return icon.startsWith('//') ? `https:${icon}` : icon
}

