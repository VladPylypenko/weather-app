import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Weather, WeatherStatus } from '../../types'
import * as api from '../../api/weatherApi'
import type { RootState } from '../../store'
import { normalize } from '../../constants/txt'

const WEATHER_HISTORY_CACHE_MS = Number((import.meta as any).env.VITE_WEATHER_HISTORY_CACHE_MS ?? '300000')

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
      const state = getState()
      const entry = state.weather.cache[normalize(city)]
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
    builder.addCase(fetchWeather.pending, (state, action) => {
      state.status = 'loading'
      state.error = undefined
      state.lastQuery = action.meta.arg
    })
    builder.addCase(fetchWeather.fulfilled, (state, action) => {
      state.status = 'succeeded'
      state.data = action.payload
      state.error = undefined
      const key = state.lastQuery ? normalize(state.lastQuery) : normalize(action.payload.city)
      state.cache[key] = { data: action.payload, ts: Date.now() }
    })
    builder.addCase(fetchWeather.rejected, (state, action) => {
      state.status = 'failed'
      state.error = action.error?.message || 'Failed to fetch weather'
    })
  },
})

export default slice.reducer
export const { setCurrentFromCache, clearWeatherCache } = slice.actions

export const selectWeather = (state: RootState) => state.weather.data
export const selectWeatherStatus = (state: RootState) => state.weather.status
export const selectWeatherError = (state: RootState) => state.weather.error
export const selectIsCityCachedFresh = (city: string) => (state: RootState) => {
  const entry = state.weather.cache[normalize(city)]
  return !!entry && Date.now() - entry.ts < WEATHER_HISTORY_CACHE_MS
}
