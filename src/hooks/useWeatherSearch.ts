import { useCallback } from 'react'
import { useAppDispatch } from '../store/hooks'
import { fetchWeather, setCurrentFromCache } from '../features/weather/weatherSlice'
import { addCity } from '../features/history/searchHistorySlice'

export function useWeatherSearch() {
  const dispatch = useAppDispatch()

  return useCallback((raw: string) => {
    const city = raw?.trim()
    if (!city) return Promise.reject(new Error('Please enter a city'))

    dispatch(setCurrentFromCache(city))

    dispatch(addCity(city))

    return dispatch(fetchWeather(city))
  }, [dispatch])
}
