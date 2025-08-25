import { useCallback } from 'react'
import { useAppDispatch } from '../store/hooks'
import { fetchWeather, setCurrentFromCache } from '../features/weather/weatherSlice'
import { addCity } from '../features/history/searchHistorySlice'

const useWeatherSearch = () => {
  const dispatch = useAppDispatch()

  return useCallback((searchQuery: string) => {
    const city = searchQuery.trim()
    if (!city) return Promise.reject(new Error('Please enter a city'))

    dispatch(setCurrentFromCache(city))

    dispatch(addCity(city))

    return dispatch(fetchWeather(city))
  }, [dispatch])
}
export { useWeatherSearch }