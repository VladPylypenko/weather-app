import { Card, CardContent, Stack, Typography, Chip, Box } from '@mui/material'
import type { Weather } from '../types'

type Props = { weather?: Weather; loading?: boolean; error?: string }

export default function WeatherCard({ weather, loading, error }: Props) {
  if (loading) return (<Card role="status" aria-busy="true"><CardContent><Typography variant="h6">Loading…</Typography></CardContent></Card>)
  
  if (error) return (<Card><CardContent><Typography variant="h6" color="error">Error</Typography><Typography>{error}</Typography></CardContent></Card>)

  if (!weather) return (<Card><CardContent><Typography variant="h6">No city selected</Typography><Typography variant="body2" color="text.secondary">Enter a city to see the current weather.</Typography></CardContent></Card>)

  return (
    <Card>
      <CardContent>
        <Stack direction="row" alignItems="center" justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h4" fontWeight={700}>{weather.city}{weather.country ? `, ${weather.country}` : ''}</Typography>
            <Typography variant="h6">{weather.description}</Typography>
            <Typography variant="h2" mt={1}>{weather.temp}°C</Typography>
          </Box>
          {weather.iconUrl && (<img src={weather.iconUrl} alt={weather.description} width={120} height={120} />)}
        </Stack>
        <Stack direction="row" spacing={1} mt={2}>
          <Chip label={`Min: ${weather.minTemp}°C`} />
          <Chip label={`Max: ${weather.maxTemp}°C`} />
          <Chip label={`Wind: ${weather.windSpeed} km/h`} />
        </Stack>
      </CardContent>
    </Card>
  )
}
