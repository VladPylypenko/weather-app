import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Weather, WeatherStatus } from '../../types'
import * as api from '../../api/weatherApi'
import type { RootState } from '../../store'
import { normalize } from '../../constants/txt'

const WEATHER_HISTORY_CACHE_MS = Number(import.meta.env.VITE_WEATHER_HISTORY_CACHE_MS ?? '300000')

type CacheEntry = { data: Weather; ts: number }
type CacheMap = Record<string, CacheEntry>


export const fetchWeather = createAsyncThunk<Weather, string, { state: RootState }>(
  'weather/fetchWeather',
  async (city) => {
    const data = await api.fetchCurrent(city)
    return data
  },
  {
    condition: (city, { getState }) => {
      const s = getState()
      const entry = s.weather.cache[normalize(city)]
      if (!entry) return true
      const fresh = Date.now() - entry.ts < WEATHER_HISTORY_CACHE_MS
      return !fresh
    },
  }
)

type WeatherState = {
  status: WeatherStatus
  error?: string
  data?: Weather
  lastQuery?: string
  cache: CacheMap
}

const initialState: WeatherState = {
  status: 'idle',
  cache: {},
}

const slice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    setCurrentFromCache(state, action: PayloadAction<string>) {
      const key = normalize(action.payload)
      const entry = state.cache[key]
      if (entry && Date.now() - entry.ts < WEATHER_HISTORY_CACHE_MS) {
        state.data = entry.data
        state.status = 'succeeded'
        state.error = undefined
        state.lastQuery = action.payload
      }
    },
    clearWeatherCache(state) {
      state.cache = {}
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWeather.pending, (s, a) => {
      s.status = 'loading'
      s.error = undefined
      s.lastQuery = a.meta.arg
    })
    builder.addCase(fetchWeather.fulfilled, (s, a) => {
      s.status = 'succeeded'
      s.data = a.payload
      s.error = undefined
      const key = s.lastQuery ? normalize(s.lastQuery) : normalize(a.payload.city)
      s.cache[key] = { data: a.payload, ts: Date.now() }
    })
    builder.addCase(fetchWeather.rejected, (s, a) => {
      s.status = 'failed'
      s.error = a.error?.message || 'Failed to fetch weather'
    })
  },
})

export default slice.reducer
export const { setCurrentFromCache, clearWeatherCache } = slice.actions

export const selectWeather = (s: RootState) => s.weather.data
export const selectWeatherStatus = (s: RootState) => s.weather.status
export const selectWeatherError = (s: RootState) => s.weather.error
export const selectIsCityCachedFresh = (city: string) => (s: RootState) => {
  const e = s.weather.cache[normalize(city)]
  return !!e && Date.now() - e.ts < WEATHER_HISTORY_CACHE_MS
}
