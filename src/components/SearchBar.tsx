import { useState } from 'react'
import { Box, TextField } from '@mui/material'

type Props = { onSearch: (city: string) => void }

const SearchBar = ({ onSearch }: Props) => {
  const [value, setValue] = useState('')

  const submit = (event: React.FormEvent) => { 
    event.preventDefault()
    const city = value.trim()
    if (city.length) {
      onSearch(city)
    }
  }
  
  return (
    <Box component="form" onSubmit={submit} noValidate sx={{ width: '100%' }}>
      <TextField
        fullWidth label="Search city" placeholder="Zhytomyr" value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Box>
  )
}
export default SearchBar