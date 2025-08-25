import { List, ListItem, ListItemButton, ListItemText, IconButton, Typography, Box, Tooltip } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'

type Props = { 
  items: string[]
  onSelect: (city: string) => void 
  onRemove: (city: string) => void 
}

const HistoryList = ({ items, onSelect, onRemove }: Props) => {
  if (!items.length) {
    return <Typography color="text.secondary">No searches yet.</Typography>
  }

  return (
    <Box sx={{ borderRadius: 1, overflow: 'hidden', border: '1px solid', borderColor: 'divider' }}>
      <List dense sx={{ py: 0 }}>
        {items.map((city) => (
          <ListItem key={city} divider disablePadding secondaryAction={
            <Tooltip title="Remove from history">
              <IconButton edge="end" aria-label={`remove ${city}`} onClick={() => onRemove(city)}><DeleteIcon /></IconButton>
            </Tooltip>
          }>
            <ListItemButton onClick={() => onSelect(city)}><ListItemText primary={city} /></ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
export default HistoryList