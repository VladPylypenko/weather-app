import { useState } from 'react'
import { Box, TextField } from '@mui/material'

type Props = { onSearch: (city: string) => void }

export default function SearchBar({ onSearch }: Props) {
  const [value, setValue] = useState('')

  const submit = (e: React.FormEvent) => { 
    e.preventDefault()
    const c = value.trim()
    if (c.length) {
      onSearch(c)
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
