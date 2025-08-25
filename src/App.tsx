
import { Container, Stack, Typography, Snackbar, Button, Alert } from '@mui/material'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import HistoryList from './components/HistoryList'
import { useAppSelector } from './store/hooks'
import { selectWeather, selectWeatherStatus, selectWeatherError } from './features/weather/weatherSlice'
import { useHistoryList } from './hooks/useHistory'
import { useWeatherSearch } from './hooks/useWeatherSearch'
import { useSnackbarUndo } from './hooks/useSnackbarUndo'

export default function App() {
  const weather = useAppSelector(selectWeather)
  const status = useAppSelector(selectWeatherStatus)
  const error = useAppSelector(selectWeatherError)
  const { items: history, remove: removeHistoryItem, lastRemoved } = useHistoryList()
  const searchWeather = useWeatherSearch()
  const { open: showUndo, setOpen: setShowUndo, onUndo } = useSnackbarUndo()

  const onSearch = (city: string) => { 
    searchWeather(city) 
  }
  
  const onRemove = (city: string) => { 
    removeHistoryItem(city) 
    setShowUndo(true) 
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4">Weather App</Typography>
        <SearchBar onSearch={onSearch} />
        <WeatherCard weather={weather} loading={status === 'loading'} error={error} />
        <Typography variant="h6" gutterBottom>Recent searches</Typography>
        <HistoryList items={history} onSelect={onSearch} onRemove={onRemove} />

        <Snackbar
          open={showUndo}
          autoHideDuration={5000}
          onClose={() => setShowUndo(false)}
          message={lastRemoved ? `Removed "${lastRemoved.value}"` : ''}
          action={<Button color="secondary" size="small" onClick={onUndo}>Undo</Button>}
        />
        {status === 'failed' && (<Alert severity="error">{error}</Alert>)}
      </Stack>
    </Container>
  )
}
