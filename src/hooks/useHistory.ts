import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectHistory, selectLastRemoved, removeCity, undoRemove } from '../features/history/searchHistorySlice'

const useHistoryList = () => {
  const items = useAppSelector(selectHistory)
  const lastRemoved = useAppSelector(selectLastRemoved)
  
  const dispatch = useAppDispatch()

  return {
    items,
    lastRemoved,
    remove: (city: string) => dispatch(removeCity(city)),
    undo: () => dispatch(undoRemove()),
  }
}
export { useHistoryList }
