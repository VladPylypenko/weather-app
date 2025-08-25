
import { useEffect, useState, useCallback } from 'react'
import { useHistoryList } from './useHistory'

export function useSnackbarUndo() {
  const { lastRemoved, undo } = useHistoryList()
  const [open, setOpen] = useState(false)

  useEffect(() => { setOpen(!!lastRemoved) }, [lastRemoved])

  const onUndo = useCallback(() => { undo(); setOpen(false) }, [undo])
  
  return { open, setOpen, onUndo, lastRemoved }
}
