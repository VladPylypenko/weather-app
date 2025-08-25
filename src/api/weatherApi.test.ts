
import { expect, test, vi } from 'vitest'
import { fetchCurrent } from './weatherApi'

global.fetch = vi.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    location: { name: 'Zhytomyr', country: 'Ukraine' },
    current: {
      temp_c: 36.6,
      condition: { text: 'Clear', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png' },
      wind_kph: 100, 
    },
    forecast: { forecastday: [{ day: { maxtemp_c: 28.9, mintemp_c: 21.1 } }] }
  })
}) as any

test('adapts WeatherAPI payload', async () => {
  ;(import.meta as any).env = { VITE_WEATHER_API_KEY: 'x' }
  const w = await fetchCurrent('Zhytomyr')
  expect(w.city).toBe('Zhytomyr')
  expect(w.country).toBe('Ukraine')
  expect(w.description).toBe('Clear')
  expect(w.temp).toBe(36.6)
  expect(w.minTemp).toBe(21.1)
  expect(w.maxTemp).toBe(28.9)
  expect(w.windSpeed).toBe(100) 
  expect(w.iconUrl?.startsWith('https://')).toBe(true)
})

