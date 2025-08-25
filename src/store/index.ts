
import { configureStore, createListenerMiddleware, isAnyOf, combineReducers } from '@reduxjs/toolkit'
import weatherReducer from '../features/weather/weatherSlice'
import historyReducer, { addCity, removeCity, clearHistory, undoRemove } from '../features/history/searchHistorySlice'

const PERSIST_KEY = 'history/v1'
const listener = createListenerMiddleware()

function loadPersisted() {
  try { const raw = localStorage.getItem(PERSIST_KEY); return raw ? JSON.parse(raw) : undefined } catch { return undefined }
}
function savePersisted(state: unknown) { try { localStorage.setItem(PERSIST_KEY, JSON.stringify(state)) } catch {} }

listener.startListening({
  matcher: isAnyOf(addCity, removeCity, clearHistory, undoRemove),
  effect: async (_action, api) => {
    const state = api.getState() as RootState
    savePersisted(state.history)
  }
})

const rootReducer = combineReducers({ weather: weatherReducer, history: historyReducer })

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: { history: loadPersisted() } as Partial<ReturnType<typeof rootReducer>>,
  middleware: (gDM) => gDM().concat(listener.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
