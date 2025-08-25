
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'
import { normalize } from '../../constants/txt'

export type HistoryState = { items: string[]; lastRemoved?: { value: string; index: number } | null }
const initialState: HistoryState = { items: [], lastRemoved: null }

const slice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addCity(state, action: PayloadAction<string>) {
      const city = normalize(action.payload)
      const index = state.items.findIndex((c) => normalize(c) === city)
      if (index >= 0) state.items.splice(index, 1)
      state.items.unshift(action.payload)
    },
    removeCity(state, action: PayloadAction<string>) {
      const index = state.items.findIndex((c) => normalize(c) === normalize(action.payload))
      if (index >= 0) {
        state.lastRemoved = { value: state.items[index], index: index }
        state.items.splice(index, 1)
      }
    },
    clearHistory(state) { state.lastRemoved=null; state.items=[] },
    undoRemove(state) {
      if (state.lastRemoved) {
        const { value, index } = state.lastRemoved
        state.items.splice(index, 0, value)
        state.lastRemoved = null
      }
    }
  }
})

export const { addCity, removeCity, clearHistory, undoRemove } = slice.actions
export default slice.reducer

export const selectHistory = (s: RootState) => s.history.items
export const selectLastRemoved = (s: RootState) => s.history.lastRemoved
