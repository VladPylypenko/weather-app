import { expect, test } from 'vitest'
import reducer, { addCity, removeCity, undoRemove, type HistoryState } from './searchHistorySlice'

const initial: HistoryState = { items: [], lastRemoved: null }

test('adds city and dedupes to top (case-insensitive)', () => {
  let state = reducer(initial, addCity('zhytomyr'))
  state = reducer(state, addCity('kyiv'))
  state = reducer(state, addCity('lviv'))
  state = reducer(state, addCity('zhytomyr'))

  expect(state.items).toEqual(['zhytomyr', 'lviv', 'kyiv'])
})

test('remove and undo restores to original index', () => {
  let state: HistoryState = { items: ['kyiv', 'lviv', 'zhytomyr'], lastRemoved: null }
  state = reducer(state, removeCity('lviv'))
  expect(state.items).toEqual(['kyiv', 'zhytomyr'])
  expect(state.lastRemoved?.value).toBe('lviv')
  state = reducer(state, undoRemove())
  expect(state.items).toEqual(['kyiv', 'lviv', 'zhytomyr'])
  expect(state.lastRemoved).toBeNull()
})